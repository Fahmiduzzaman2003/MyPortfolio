# Fix Email Reply Timeout

## Problem
Gmail SMTP times out on Render cloud servers (Gmail blocks connections from cloud IPs).

## Solution
Use SendGrid (free, designed for cloud servers).

## Setup Steps

### 1. Create Free SendGrid Account
1. Go to: https://signup.sendgrid.com/
2. Sign up (free tier: 100 emails/day forever)
3. Verify your email

### 2. Get API Key
1. After login, go to: **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name: "Portfolio Backend"
4. Permissions: **"Full Access"**
5. Click **"Create & View"**
6. **Copy the API key** (shows only once!)

### 3. Verify Sender Email
1. Go to: **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Enter your email: `zfahmid54@gmail.com`
4. Fill form and submit
5. Check your email and click verification link

### 4. Add to Render Environment
Go to Render → Backend → Environment → Add:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=zfahmid54@gmail.com
```

### 5. Redeploy
Save → Render auto-redeploys

## Done!
Reply emails will now work perfectly! No more timeouts.

## Fallback
If SendGrid not configured, tries Gmail (but may timeout on Render).
