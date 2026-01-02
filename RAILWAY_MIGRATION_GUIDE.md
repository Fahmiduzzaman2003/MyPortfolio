# Railway Migration Guide

## Step 1: Sign Up for Railway
1. Go to https://railway.app/
2. Click "Start a New Project"
3. Sign up with GitHub (recommended)
4. Verify your account

## Step 2: Create MySQL Database
1. In Railway dashboard, click "New Project"
2. Click "Provision MySQL"
3. Railway will create a MySQL database
4. Note: This database will NEVER pause!

## Step 3: Get Your Database Credentials
1. Click on the MySQL service in your Railway project
2. Go to "Variables" tab
3. You'll see:
   - `MYSQL_URL` (full connection string)
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

## Step 4: Export Data from Aiven (IMPORTANT!)

### Option A: If Aiven is Running
1. Power on your Aiven service
2. Wait for it to start (2-3 minutes)
3. Use MySQL Workbench or phpMyAdmin to export:
   - Connect to: `mysql-3387e9a5-fahmiduxaman-cef4.1.aivencloud.com`
   - Port: `28428`
   - Export all tables as SQL dump
   - Save as `aiven-backup.sql`

### Option B: Using Command Line (if you have mysql client)
```bash
# In PowerShell
mysqldump -h mysql-3387e9a5-fahmiduxaman-cef4.1.aivencloud.com -P 28428 -u avnadmin -p portfolio_db > aiven-backup.sql
```

### Tables to Export:
- users
- profile
- education
- skills
- projects
- research
- achievements
- co_curricular_activities
- experience
- coding_platforms
- coding_stats
- contact_info
- messages

## Step 5: Deploy Backend to Railway

### Via GitHub (Recommended):
1. Push your backend folder to a GitHub repository
2. In Railway, click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js and deploy

### Via Railway CLI:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend folder
cd backend

# Initialize Railway project
railway init

# Link to your Railway project
railway link

# Deploy
railway up
```

## Step 6: Set Environment Variables on Railway

1. In Railway dashboard, click your backend service
2. Go to "Variables" tab
3. Add these variables:

```
DB_HOST=<from Railway MySQL Variables>
DB_PORT=<from Railway MySQL Variables>
DB_USER=<from Railway MySQL Variables>
DB_PASSWORD=<from Railway MySQL Variables>
DB_NAME=<from Railway MySQL Variables>
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
EMAIL_USER=zfahmid54@gmail.com
EMAIL_PASSWORD=rhtw ebna qabl wfqb
EMAIL_FROM=zfahmid54@gmail.com
ADMIN_EMAIL=zfahmid54@gmail.com
```

**OR** use Railway's reference variables:
```
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
```

## Step 7: Initialize Database Schema

1. In Railway, click on your backend service
2. Go to "Deployments" tab
3. Wait for deployment to complete
4. Click on the deployment → "View Logs"

### Import Schema:
Use Railway's MySQL client or run this script:

```bash
# Connect to Railway MySQL
railway run node init-db.js
```

Or manually import via Railway's MySQL client:
1. Go to MySQL service → "Data" tab
2. Use the query editor to run your schema files:
   - `database/schema.sql`
   - `database/init-data.sql`

## Step 8: Import Your Data

### Option A: Via Railway MySQL Client
1. Click MySQL service → "Data" tab
2. Click "Query"
3. Copy content from `aiven-backup.sql`
4. Execute the queries

### Option B: Via Command Line
```bash
# Get Railway MySQL connection string
railway variables

# Import data
mysql -h <RAILWAY_MYSQL_HOST> -P <PORT> -u <USER> -p<PASSWORD> <DATABASE> < aiven-backup.sql
```

### Option C: Via Node Script (Easiest)
Create a migration script in backend:

```javascript
// backend/migrate-to-railway.js
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  // Read and execute schema files
  const fs = require('fs').promises;
  const schema = await fs.readFile('./database/schema.sql', 'utf8');
  await connection.query(schema);
  
  console.log('Schema created successfully!');
  await connection.end();
}

migrate();
```

Then run:
```bash
railway run node migrate-to-railway.js
```

## Step 9: Get Your Backend URL

1. In Railway, click your backend service
2. Go to "Settings" tab
3. Scroll to "Environment"
4. Click "Generate Domain"
5. Copy the URL (e.g., `your-backend.railway.app`)

## Step 10: Update Frontend

Update your frontend `.env` file:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

Then redeploy your Vercel frontend:
```bash
git add .
git commit -m "Update API URL to Railway"
git push
```

Vercel will auto-deploy.

## Step 11: Test Everything

1. Visit your frontend site
2. Login to admin panel
3. Check all sections (profile, education, projects, etc.)
4. Verify data is showing correctly

## Benefits of Railway:
✅ Backend never sleeps (unlike Render free tier)
✅ Database never pauses (unlike Aiven)
✅ $5 free credit monthly
✅ Simple deployment
✅ Better performance
✅ Single dashboard for both services

## Costs:
- Free tier: $5 credit/month (lasts ~1-2 months for your usage)
- After credits: ~$3-5/month total
- Still way better than dealing with pausing services!

## Troubleshooting:

### If deployment fails:
1. Check logs in Railway dashboard
2. Ensure all environment variables are set
3. Verify `package.json` has correct start script

### If database connection fails:
1. Verify environment variables match Railway MySQL variables
2. Check Railway MySQL is running (green status)
3. Review backend logs for connection errors

### If data doesn't show:
1. Verify schema was imported correctly
2. Check if tables exist in Railway MySQL
3. Import your backup data again

## Need Help?
- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
