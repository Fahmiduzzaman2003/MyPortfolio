# Two-Factor Authentication (2FA) Setup Guide

This guide will help you enable Google Authenticator two-factor authentication for your admin account.

## Prerequisites

- Google Authenticator app installed on your smartphone
  - [iOS App Store](https://apps.apple.com/app/google-authenticator/id388497605)
  - [Android Play Store](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)

## Step 1: Database Migration

Run the database migration to add 2FA fields to your users table:

```sql
-- Connect to your MySQL database and run:
USE portfolio_db;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_factor_backup_codes JSON DEFAULT NULL;
```

Or run the migration file:
```bash
# If you have MySQL client installed
mysql -h mysql-3387e9a5-fahmiduxaman-cef4.1.aivencloud.com -P 28428 -u avnadmin -p portfolio_db < backend/database/setup_2fa.sql
```

## Step 2: Verify Your Admin Account

Make sure your admin account (fahmiduxxaman@gmail.com) exists in the database:

```sql
SELECT email, role, two_factor_enabled FROM users WHERE email = 'fahmiduxxaman@gmail.com';
```

## Step 3: Start the Backend Server

```bash
cd backend
npm run dev
```

The backend should start on http://localhost:5000

## Step 4: Enable 2FA

1. **Login to Admin Panel**
   - Go to http://localhost:5173/auth
   - Login with your email and password

2. **Navigate to Security Settings**
   - Click on "Security" in the admin sidebar
   - Click "Enable Two-Factor Authentication"

3. **Scan QR Code**
   - Open Google Authenticator app on your phone
   - Tap the "+" button
   - Choose "Scan a QR code"
   - Scan the QR code displayed on screen

4. **Enter Verification Code**
   - Enter the 6-digit code from Google Authenticator
   - Click "Verify & Enable"

5. **Save Backup Codes**
   - **IMPORTANT**: Download and save your 10 backup codes
   - Each code can only be used once
   - Store them in a safe place (password manager, encrypted file, etc.)
   - You'll need these if you lose access to your phone

## Step 5: Test 2FA Login

1. **Logout**
   - Click "Sign Out" in the admin panel

2. **Login Again**
   - Enter your email and password
   - You'll be prompted for a 2FA code
   - Enter the 6-digit code from Google Authenticator
   - Click "Verify Code"

3. **Success!**
   - You should now be logged in
   - Your account is now protected with 2FA

## Using 2FA

### Normal Login Process
1. Enter email and password
2. Enter the 6-digit code from Google Authenticator app
3. Access granted!

### Using Backup Codes
If you lose access to your phone:
1. Enter email and password
2. Instead of the authenticator code, enter one of your backup codes
3. Each backup code can only be used once
4. After logging in, go to Security settings to disable and re-enable 2FA

## Troubleshooting

### "Invalid verification code" error
- Make sure your phone's time is synced correctly
- The code changes every 30 seconds
- Try waiting for a new code

### Lost access to authenticator app
- Use one of your backup codes to login
- After logging in, you can disable and re-enable 2FA to get a new QR code

### Backend not starting
- Check if all dependencies are installed: `npm install`
- Make sure ports 5000 (backend) and 5173 (frontend) are available
- Check `.env` file has correct database credentials

## Security Best Practices

1. **Never share your backup codes** - Store them securely
2. **Don't screenshot QR codes** - They can be used to access your account
3. **Use backup codes wisely** - Each can only be used once
4. **Keep authenticator app updated** - For latest security patches
5. **Regular account reviews** - Check security settings periodically

## API Endpoints

The following 2FA endpoints are available:

- `POST /api/2fa/setup` - Generate QR code for 2FA setup
- `POST /api/2fa/verify` - Verify and enable 2FA
- `POST /api/2fa/validate` - Validate 2FA code during login
- `GET /api/2fa/status/:email` - Check if 2FA is enabled
- `POST /api/2fa/disable` - Disable 2FA (requires password)

## Technical Details

### Backend Changes
- Added `speakeasy` package for TOTP generation
- Added `qrcode` package for QR code generation
- New route file: `backend/src/routes/twoFactor.js`
- Database columns: `two_factor_secret`, `two_factor_enabled`, `two_factor_backup_codes`

### Frontend Changes
- Updated Auth page to handle 2FA code input
- New Security Settings page in admin panel
- TwoFactorSetup component for QR code display
- Updated AuthContext with 2FA functions

### How It Works
1. **Setup**: Server generates a secret key and QR code
2. **Verification**: User scans QR code, server verifies TOTP code
3. **Login**: User enters password, then TOTP code from authenticator
4. **Validation**: Server validates TOTP against stored secret

## Support

For issues or questions:
- Check the backend logs for errors
- Ensure database migration ran successfully
- Verify all npm packages are installed
- Test backend endpoints with curl or Postman

---

**Admin Email**: fahmiduxxaman@gmail.com  
**Last Updated**: January 30, 2026
