# Email Configuration Guide

## Gmail SMTP Setup for Contact Form & Reply System

### Step 1: Enable 2-Factor Authentication on Gmail

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Follow the steps to enable 2FA

### Step 2: Generate App-Specific Password

1. After enabling 2FA, go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter a name like "Portfolio Backend"
5. Click **Generate**
6. **IMPORTANT**: Copy the 16-character password (without spaces)

### Step 3: Update Backend .env File

Open `backend/.env` and update these values:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password-here
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=your-email@gmail.com
```

**Example:**
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=john.doe@gmail.com
ADMIN_EMAIL=john.doe@gmail.com
```

### Step 4: Test the Setup

1. Restart your backend server
2. Submit a test message through your contact form
3. Check your Gmail inbox - you should receive a notification
4. Go to Admin Panel → Messages
5. Click the **Reply** button (blue icon) on any message
6. Type your reply and send - the sender will receive it in their email

## Features Implemented

### 🔔 Email Notifications
- **Automatic**: When someone submits a contact form, you receive an instant email notification
- **Formatted**: Beautiful HTML email with sender info and message content
- **Non-blocking**: Email sending doesn't slow down the form submission

### 💌 Reply System
- **Admin Panel**: Reply button (blue icon) next to each message
- **Dialog Interface**: Clean form to compose reply
- **Original Message**: Shows the original message for context
- **Custom Subject**: Modify email subject line
- **Direct Delivery**: Sends from your Gmail to sender's email

### 🎨 Email Templates
- Professional HTML formatting
- Color-coded (Green for new messages, Blue for replies)
- Mobile-responsive design
- Includes original message in replies

## Troubleshooting

### "Email not configured" Warning
**Cause**: Missing EMAIL_USER or EMAIL_PASSWORD in .env
**Solution**: Follow Step 3 above

### "Invalid credentials" Error
**Cause**: Wrong email or app password
**Solution**: 
- Verify email address is correct
- Generate a new app-specific password
- Remove spaces from password in .env

### "Less secure app access" Error
**Cause**: Trying to use regular password instead of app password
**Solution**: Must use app-specific password (Step 2)

### Email Not Received
**Check**:
- Spam/Junk folder
- Email address in ADMIN_EMAIL is correct
- Backend server is running
- Console logs for error messages

## Security Notes

⚠️ **Never commit .env file to Git**
- Already in .gitignore
- Contains sensitive credentials

✅ **App Passwords are Safer**
- Limited to specific application
- Can be revoked without changing main password
- Doesn't expose your actual Gmail password

## Testing Checklist

- [ ] Backend server starts without email warnings
- [ ] Contact form submission works
- [ ] Notification email received in Gmail
- [ ] Reply button appears in admin panel
- [ ] Reply dialog opens with original message
- [ ] Reply email sends successfully
- [ ] Sender receives reply in their inbox
- [ ] Message marked as read after reply

## Email Service Alternatives

If Gmail doesn't work for you, you can modify `backend/src/config/email.js` to use:

- **SendGrid**: Transactional email service
- **Mailgun**: Email automation
- **AWS SES**: Amazon Simple Email Service
- **Outlook/Hotmail**: Microsoft email service

---

**Status**: ✅ Ready to use after configuration
**Last Updated**: December 29, 2025
