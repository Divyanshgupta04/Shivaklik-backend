const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const { verifyEmailTransport } = require('./utils/email');

const app = express();
const server = http.createServer(app);
// CORS configuration - use environment variable for production
// const allowedOrigins = process.env.FRONTEND_URL 
//   ? [process.env.FRONTEND_URL, "http://localhost:5173"]
//   : ["http://localhost:5173"];

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors());

app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.ATLAS_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/shivalik_service_hub',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production (https)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // for cross-site cookies in production
  }
}));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI || 'mongodb://localhost:27017/shivalik_service_hub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Verify email transporter on startup (logs status)
verifyEmailTransport();

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user-auth', require('./routes/userAuth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/stats', require('./routes/stats'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Shivalik Service Hub Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
