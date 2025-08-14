# 🚀 Simple Deployment Guide - Vercel + Railway

## Step 1: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose:** `shashi0808/udyam-registration-portal`
6. **Railway will auto-deploy the backend**

### Set Environment Variables in Railway:
Go to your Railway project → Variables tab → Add these:

```
NODE_ENV=production
PORT=5000
CORS_ORIGIN=*
DEMO_MODE=true
MOCK_OTP=123456
```

**Copy your Railway backend URL** (looks like: `https://your-app.railway.app`)

## Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import:** `shashi0808/udyam-registration-portal`
5. **Set Root Directory to:** `udyam-registration`
6. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app/api
   ```
7. **Deploy**

## Step 3: Test Your Deployment

1. **Visit your Vercel URL** (provided after deployment)
2. **Test the registration form**
3. **Use demo credentials:**
   - Aadhaar: Any 12 digits (e.g., 123456789012)
   - OTP: 123456
   - PAN: Any valid format (e.g., ABCDE1234F)

## 🎉 You're Done!

Your Udyam Registration Portal is now live at:
- **Frontend**: Your Vercel URL
- **Backend**: Your Railway URL

Both platforms will auto-deploy when you push changes to GitHub!

## Quick Links:
- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Your GitHub Repo: https://github.com/shashi0808/udyam-registration-portal