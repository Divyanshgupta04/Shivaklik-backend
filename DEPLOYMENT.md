# Deployment Guide for Render with MongoDB Atlas

## Overview
This guide will help you deploy your Node.js + Express + MongoDB backend to Render using MongoDB Atlas.

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier available)
- Render account (free tier available)

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create/Verify MongoDB Atlas Cluster
You already have an Atlas URI in your `.env` file:
```
mongodb+srv://guptadivyansh04_db_user:pbLqw6QSS4CitNvu@cluster23.jkddbhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster23
```

### 1.2 Configure Network Access
1. Go to MongoDB Atlas Dashboard
2. Click on "Network Access" in the left sidebar
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This is necessary for Render to connect
5. Click "Confirm"

### 1.3 Add Database Name to Connection String
Your current Atlas URI is missing the database name. Update it to:
```
mongodb+srv://guptadivyansh04_db_user:pbLqw6QSS4CitNvu@cluster23.jkddbhp.mongodb.net/shivalik_service_hub?retryWrites=true&w=majority&appName=Cluster23
```

---

## Step 2: Prepare Your Repository

### 2.1 Verify .gitignore
Ensure `.env` is in your `.gitignore` file (already done):
```
node_modules
.env
.DS_Store
*.log
coverage
.vscode
```

### 2.2 Commit and Push Changes
```bash
git add .
git commit -m "Prepare for Render deployment with MongoDB Atlas"
git push origin main
```

---

## Step 3: Deploy to Render

### 3.1 Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" button
3. Select "Web Service"
4. Connect your GitHub repository
5. Select your backend repository

### 3.2 Configure Web Service

**Basic Settings:**
- **Name**: `shivalik-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave blank (unless your backend is in a subdirectory)
- **Runtime**: `Node`

**Build & Deploy Settings:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select "Free" for testing (or paid plan for production)

### 3.3 Add Environment Variables

Click on "Advanced" and add the following environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Sets app to production mode |
| `PORT` | `10000` | Render's default port (or leave blank) |
| `ATLAS_URI` | `mongodb+srv://guptadivyansh04_db_user:pbLqw6QSS4CitNvu@cluster23.jkddbhp.mongodb.net/shivalik_service_hub?retryWrites=true&w=majority&appName=Cluster23` | Your MongoDB Atlas connection string with database name |
| `JWT_SECRET` | `your_super_secret_jwt_key_here` | Keep or generate a new secure secret |
| `SESSION_SECRET` | `your_session_secret_key_here` | Keep or generate a new secure secret |
| `EMAIL_USER` | `urbanscale01@gmail.com` | Your email for sending notifications |
| `EMAIL_PASS` | `azsxieybjyccootl` | Your Gmail app password |
| `RAZORPAY_KEY_ID` | `rzp_test_1cmLMCHeUw6Jtc` | Your Razorpay key (use production key for live) |
| `RAZORPAY_SECRET` | `0vQ6PIdFsseYuinbUSzWDT5d` | Your Razorpay secret |
| `FRONTEND_URL` | `https://your-frontend-url.com` | Your frontend URL (add after deploying frontend) |

**Important Notes:**
- Generate strong secrets for production (use a password generator)
- For Razorpay, use production keys when going live
- Add `FRONTEND_URL` once you deploy your frontend

### 3.4 Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for the deployment to complete (usually 2-5 minutes)

---

## Step 4: Post-Deployment

### 4.1 Get Your Backend URL
After deployment, Render will provide a URL like:
```
https://shivalik-backend.onrender.com
```

### 4.2 Test Your Deployment

**Health Check:**
```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2025-03-10T10:45:00.000Z"
}
```

**API Root:**
```bash
curl https://your-app-name.onrender.com/
```

Expected response:
```json
{
  "message": "Shivalik Service Hub Backend API",
  "version": "1.0.0",
  "status": "running"
}
```

### 4.3 Update Frontend Configuration
Update your frontend to use the Render backend URL instead of `http://localhost:5000`

### 4.4 Update CORS Settings
Once your frontend is deployed, update the `FRONTEND_URL` environment variable in Render to your actual frontend URL.

---

## Step 5: Monitoring and Logs

### 5.1 View Logs
- Go to your Render dashboard
- Click on your web service
- Click "Logs" tab to see real-time logs

### 5.2 Health Checks
Render automatically monitors the `/health` endpoint to ensure your service is running.

---

## Common Issues and Solutions

### Issue 1: MongoDB Connection Failed
**Solution:** 
- Verify your MongoDB Atlas connection string includes the database name
- Ensure "Allow Access from Anywhere" is enabled in Network Access
- Check that your MongoDB credentials are correct

### Issue 2: Environment Variables Not Working
**Solution:**
- Double-check all environment variable names (case-sensitive)
- Restart your service after updating environment variables
- Verify no quotes around values in Render environment variables

### Issue 3: CORS Errors
**Solution:**
- Ensure `FRONTEND_URL` environment variable is set correctly
- Check that credentials are enabled in CORS configuration
- Verify your frontend URL doesn't have trailing slashes

### Issue 4: Session Not Persisting
**Solution:**
- Verify MongoDB Atlas connection is working
- Check that `secure: true` is set for production
- Ensure `sameSite: 'none'` for cross-origin cookies

### Issue 5: Cold Starts (Free Tier)
**Note:** Render free tier services spin down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.

---

## Security Best Practices

1. **Secrets Management:**
   - Never commit `.env` file to Git
   - Use strong, unique secrets for JWT and sessions
   - Rotate secrets periodically

2. **Database Security:**
   - Use strong passwords for MongoDB users
   - Regularly review database access logs
   - Enable MongoDB Atlas encryption at rest

3. **API Security:**
   - Implement rate limiting for production
   - Use HTTPS only (Render provides this automatically)
   - Validate and sanitize all user inputs

4. **Environment Variables:**
   - Use production credentials for live deployment
   - Never log sensitive environment variables
   - Separate development and production configurations

---

## Scaling Considerations

### Free Tier Limitations:
- 750 hours/month free
- Automatic spin down after 15 minutes of inactivity
- Shared resources

### Upgrading:
- For production, consider paid plans for:
  - Always-on instances
  - Better performance
  - Custom domains
  - More memory/CPU

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

## Quick Reference Commands

### Test Local Development with Atlas:
```bash
# Set NODE_ENV to development in .env
NODE_ENV=development

# Run the server
npm start
```

### Deploy Updates:
```bash
git add .
git commit -m "Your commit message"
git push origin main
# Render will automatically redeploy
```

### View Render Logs:
```bash
# Use Render dashboard or CLI
render logs -s your-service-name
```

---

## Support

If you encounter issues:
1. Check Render logs for error messages
2. Verify MongoDB Atlas connection
3. Test endpoints using Postman or curl
4. Review this documentation for common issues

---

## Checklist for Deployment

- [ ] MongoDB Atlas cluster created and configured
- [ ] Network access set to "Allow Access from Anywhere"
- [ ] Database name added to Atlas URI
- [ ] `.gitignore` includes `.env`
- [ ] Code committed and pushed to GitHub
- [ ] Render web service created
- [ ] All environment variables added in Render
- [ ] Service deployed successfully
- [ ] Health check endpoint tested
- [ ] API endpoints tested
- [ ] Frontend updated with backend URL
- [ ] CORS configured with frontend URL

---

**Deployment Date:** _____________________

**Backend URL:** _____________________

**Frontend URL:** _____________________

**MongoDB Cluster:** Cluster23
