# 🚀 COMPLETE DEPLOYMENT GUIDE

Your portfolio is deployed to Vercel but showing no data because the **backend is not deployed**. Follow these steps:

---

## 📋 DEPLOYMENT STEPS

### STEP 1: Deploy Database (MySQL on Aiven - FREE)

1. **Go to**: https://aiven.io/
2. **Sign up** with GitHub (free tier includes MySQL)
3. **Create a MySQL service:**
   - Service: MySQL
   - Cloud: AWS
   - Region: Choose closest to you
   - Plan: **Hobbyist (FREE)**
4. **Wait 5-10 minutes** for service to start
5. **Get connection details:**
   - Host: `xxx.aivencloud.com`
   - Port: `xxxxx`
   - User: `avnadmin`
   - Password: (shown once)
   - Database: `defaultdb`
6. **Run your schema:**
   - Click "Query Editor" in Aiven dashboard
   - Copy content from `backend/database/schema.sql`
   - Paste and execute
   - Copy content from `backend/database/init-data.sql`
   - Paste and execute

---

### STEP 2: Deploy Backend to Render (FREE)

1. **Go to**: https://render.com/
2. **Sign up** with GitHub
3. **New > Web Service**
4. **Connect your repository:** `Fahmiduzzaman2003/MyPortfolio`
5. **Configure:**
   - Name: `portfolio-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node src/index.js`
   - Instance Type: **Free**

6. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=<your-aiven-host>.aivencloud.com
   DB_PORT=<your-aiven-port>
   DB_USER=avnadmin
   DB_PASSWORD=<your-aiven-password>
   DB_NAME=defaultdb
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

7. **Click "Create Web Service"**
8. **Wait 5-10 minutes** for deployment
9. **Copy your backend URL:** `https://portfolio-backend-xxxx.onrender.com`

---

### STEP 3: Update Frontend to Use Deployed Backend

1. **In your local project**, create/update `.env` file:
   ```
   VITE_API_URL=https://portfolio-backend-xxxx.onrender.com/api
   ```
   (Replace with YOUR actual Render URL from step 2.9)

2. **Go to Vercel Dashboard:**
   - Open your project
   - Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://portfolio-backend-xxxx.onrender.com/api`

3. **Redeploy frontend:**
   ```bash
   git add .
   git commit -m "Add backend API URL for production"
   git push origin main
   ```

Vercel will auto-deploy!

---

## 🎯 HOW IT WILL WORK AFTER DEPLOYMENT

### For Regular Users:
1. Visit: `https://myportfolioweb-blond.vercel.app/`
2. See your complete portfolio with all data
3. Can send you messages via contact form

### For Admin (You):
1. Visit: `https://myportfolioweb-blond.vercel.app/auth`
2. Login with your credentials
3. Get redirected to admin panel
4. Manage all content (profile, projects, skills, etc.)

---

## 🔑 CREATE ADMIN ACCOUNT

After backend is deployed, you need to create an admin account:

### Option A: Using API directly (Postman/Thunder Client)
```
POST https://portfolio-backend-xxxx.onrender.com/api/auth/register
Content-Type: application/json

{
  "email": "your-email@gmail.com",
  "password": "your-strong-password"
}
```

### Option B: Using MySQL directly (in Aiven Query Editor)
```sql
-- First, generate a password hash at: https://bcrypt-generator.com/
-- Use your desired password and rounds: 10

INSERT INTO users (email, password, role) 
VALUES ('your-email@gmail.com', '$2a$10$your-bcrypt-hash-here', 'admin');
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Database deployed on Aiven
- [ ] Database schema imported
- [ ] Backend deployed on Render
- [ ] Backend environment variables set
- [ ] Backend URL is accessible (visit in browser, should see "Cannot GET /")
- [ ] Admin account created
- [ ] Frontend .env updated with backend URL
- [ ] Vercel environment variable added
- [ ] Frontend redeployed
- [ ] Portfolio shows data at vercel link
- [ ] Can login at /auth and access admin panel

---

## 🆘 TROUBLESHOOTING

### Frontend shows no data:
- Check browser console (F12) for API errors
- Verify VITE_API_URL is correct in Vercel settings
- Ensure backend URL ends with `/api`

### Backend won't start:
- Check Render logs for errors
- Verify all environment variables are set
- Check database connection details

### Can't login:
- Verify admin account was created in database
- Check JWT_SECRET is set in Render environment variables
- Ensure email/password are correct

---

## 📞 NEED HELP?

If stuck, check:
1. Render logs: Dashboard → Logs
2. Browser console: F12 → Console tab
3. Database connection: Aiven dashboard → Connection info

---

## 🎉 AFTER SUCCESSFUL DEPLOYMENT

Your portfolio will be fully live with:
- ✅ Public portfolio at: https://myportfolioweb-blond.vercel.app/
- ✅ Admin panel at: https://myportfolioweb-blond.vercel.app/auth
- ✅ Backend API at: https://portfolio-backend-xxxx.onrender.com
- ✅ Database hosted on Aiven

Users see your customized data, you can manage everything via admin panel!
