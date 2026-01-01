# Cloudinary Setup for Image Storage

## Problem
Render's filesystem is ephemeral - every deployment deletes uploaded files. This causes images to disappear.

## Solution
Use Cloudinary (free cloud storage) - images persist permanently.

## Setup Steps

### 1. Create Free Cloudinary Account
1. Go to: https://cloudinary.com/users/register_free
2. Sign up (free tier: 25GB storage, 25GB bandwidth/month)
3. After signup, go to Dashboard

### 2. Get Your Credentials
From Cloudinary Dashboard, copy:
- **Cloud Name** (e.g., `dxxxxx`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijk...`)

### 3. Add to Render Environment Variables
Go to Render → Your backend service → Environment tab → Add:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Redeploy Backend
Render will automatically redeploy after saving environment variables.

## Done!
All future image uploads will be stored on Cloudinary permanently.
Existing images in database won't work (need to re-upload them via admin panel).

## Benefits
✅ Images never disappear on redeploy
✅ Free 25GB storage
✅ Automatic CDN (fast loading worldwide)
✅ Image optimization built-in
