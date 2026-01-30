const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupAdminTwoFactor() {
  const adminEmail = 'fahmiduxxaman@gmail.com';
  
  console.log('Setting up 2FA for:', adminEmail);
  
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      connectTimeout: 30000
    });

    console.log('✓ Connected to database\n');

    // Check if user exists
    const [users] = await connection.query(
      'SELECT id, email, two_factor_enabled FROM users WHERE email = ?',
      [adminEmail]
    );

    if (users.length === 0) {
      console.error('❌ User not found:', adminEmail);
      process.exit(1);
    }

    const user = users[0];

    if (user.two_factor_enabled) {
      console.log('⚠ 2FA is already enabled for this account');
      console.log('If you want to reset it, disable 2FA first\n');
      process.exit(0);
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Portfolio Admin (${adminEmail})`,
      issuer: 'Portfolio'
    });

    console.log('✓ Generated 2FA secret\n');

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    // Save to HTML file for easy viewing
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>2FA Setup - Portfolio Admin</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    .qr-container { text-align: center; margin: 30px 0; }
    .qr-code { max-width: 300px; border: 2px solid #333; padding: 20px; }
    .secret { background: #f5f5f5; padding: 15px; border-radius: 5px; word-break: break-all; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    h1 { color: #333; }
    .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>🔐 Two-Factor Authentication Setup</h1>
  
  <div class="warning">
    <strong>⚠️ IMPORTANT:</strong> Scan this QR code NOW with Google Authenticator. This page will not be shown again!
  </div>

  <div class="step">
    <h3>Step 1: Scan QR Code</h3>
    <p>Open Google Authenticator app on your phone and scan this QR code:</p>
    <div class="qr-container">
      <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code" />
    </div>
  </div>

  <div class="step">
    <h3>Step 2: Manual Entry (if QR doesn't work)</h3>
    <p>Or enter this secret key manually in Google Authenticator:</p>
    <div class="secret">
      <strong>Secret Key:</strong><br>
      ${secret.base32}
    </div>
  </div>

  <div class="step">
    <h3>Step 3: Test Your Setup</h3>
    <p>1. Check Google Authenticator - you should see a 6-digit code</p>
    <p>2. The code changes every 30 seconds</p>
    <p>3. Now run: <code>node enable-2fa.js [6-digit-code]</code></p>
  </div>

  <div class="warning">
    <p><strong>Account:</strong> ${adminEmail}</p>
    <p><strong>Status:</strong> 2FA Secret Generated (Not Enabled Yet)</p>
  </div>
</body>
</html>`;

    const fs = require('fs');
    const filePath = './2fa-setup-qr-code.html';
    fs.writeFileSync(filePath, html);

    // Save secret to database (but don't enable yet)
    await connection.query(
      'UPDATE users SET two_factor_secret = ? WHERE id = ?',
      [secret.base32, user.id]
    );

    console.log('✓ 2FA secret saved to database');
    console.log('✓ QR code saved to:', filePath);
    console.log('\n📱 NEXT STEPS:');
    console.log('1. Open the file:', filePath);
    console.log('2. Scan the QR code with Google Authenticator');
    console.log('3. Run: node enable-2fa.js [6-digit-code-from-app]');
    console.log('\nThis will verify and enable 2FA for your account.\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupAdminTwoFactor();
