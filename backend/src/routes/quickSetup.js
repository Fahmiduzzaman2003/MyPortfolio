const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const pool = require('../config/database');

const router = express.Router();

// Verify code and enable 2FA
router.get('/enable-2fa/:code', async (req, res) => {
  const adminEmail = 'fahmiduxxaman@gmail.com';
  const secret = 'LBCEERCTIB2FIVDFNNBSSJTCOEVECMBYJYQWELT2OY2DUYZELIXQ';
  const code = req.params.code;
  
  try {
    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) {
      return res.send('<h1>❌ Invalid Code</h1><p>The code you entered is incorrect or expired. Please try with a new code from Google Authenticator.</p>');
    }

    // Add columns if they don't exist
    const [columns] = await pool.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(col => col.Field);
    
    if (!columnNames.includes('two_factor_secret')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL');
    }
    if (!columnNames.includes('two_factor_enabled')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE');
    }
    if (!columnNames.includes('two_factor_backup_codes')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_backup_codes JSON DEFAULT NULL');
    }

    // Enable 2FA
    await pool.query(
      'UPDATE users SET two_factor_secret = ?, two_factor_enabled = TRUE WHERE email = ?',
      [secret, adminEmail]
    );

    res.send(`
      <html>
      <head><title>2FA Enabled!</title>
      <style>body{font-family:Arial;max-width:600px;margin:50px auto;padding:20px;text-align:center;}h1{color:#10b981;}</style>
      </head>
      <body>
        <h1>✅ 2FA Enabled Successfully!</h1>
        <p>Two-Factor Authentication is now active for ${adminEmail}</p>
        <p><strong>Next time you login:</strong></p>
        <ol style="text-align:left;">
          <li>Enter your email and password</li>
          <li>You'll be asked for a 6-digit code</li>
          <li>Open Google Authenticator</li>
          <li>Enter the code for "Portfolio Admin"</li>
          <li>Login successful! 🎉</li>
        </ol>
        <a href="/auth" style="display:inline-block;background:#667eea;color:white;padding:15px 30px;text-decoration:none;border-radius:8px;margin-top:20px;">Go to Login</a>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(500).send(`<h1>Error: ${error.message}</h1>`);
  }
});


// Simple 2FA activation endpoint
router.get('/activate-2fa-for-admin', async (req, res) => {
  const adminEmail = 'fahmiduxxaman@gmail.com';
  const secret = 'LBCEERCTIB2FIVDFNNBSSJTCOEVECMBYJYQWELT2OY2DUYZELIXQ';
  
  try {
    // Add columns if they don't exist
    const [columns] = await pool.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(col => col.Field);
    
    if (!columnNames.includes('two_factor_secret')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL');
    }
    if (!columnNames.includes('two_factor_enabled')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE');
    }
    if (!columnNames.includes('two_factor_backup_codes')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_backup_codes JSON DEFAULT NULL');
    }

    // Enable 2FA
    await pool.query(
      'UPDATE users SET two_factor_secret = ?, two_factor_enabled = TRUE WHERE email = ?',
      [secret, adminEmail]
    );

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>2FA Activated!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container { 
            background: white;
            max-width: 600px;
            width: 100%;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          h1 { 
            color: #10b981;
            font-size: 32px;
            margin-bottom: 10px;
            text-align: center;
          }
          .success-icon {
            text-align: center;
            font-size: 80px;
            margin-bottom: 20px;
          }
          .section { 
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            margin: 20px 0;
            border-left: 5px solid #667eea;
          }
          .section h3 { 
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .section p { 
            color: #555;
            line-height: 1.6;
            margin: 8px 0;
          }
          .secret-box { 
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            border: 2px dashed #667eea;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            color: #667eea;
            margin: 15px 0;
            word-break: break-all;
          }
          .step-number { 
            background: #667eea;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            font-weight: bold;
          }
          .highlight { 
            background: #fef3c7;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
          }
          .button {
            background: #667eea;
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            font-weight: 600;
            text-align: center;
            width: 100%;
            margin-top: 20px;
            transition: background 0.3s;
          }
          .button:hover { background: #5568d3; }
          .emoji { font-size: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>2FA Activated!</h1>
          <p style="text-align: center; color: #666; margin-bottom: 30px;">
            Two-Factor Authentication is now enabled for ${adminEmail}
          </p>

          <div class="section">
            <h3><span class="emoji">📱</span> Add to Google Authenticator</h3>
            <p><span class="step-number">1</span> Open <span class="highlight">Google Authenticator</span> app on your phone</p>
            <p><span class="step-number">2</span> Tap the <span class="highlight">+</span> button</p>
            <p><span class="step-number">3</span> Select <span class="highlight">Enter a setup key</span></p>
            <p><span class="step-number">4</span> Enter these details:</p>
            <div style="margin: 15px 0 15px 40px;">
              <p><strong>Account name:</strong> Portfolio Admin</p>
              <p><strong>Your key:</strong></p>
              <div class="secret-box">${secret}</div>
              <p><strong>Type:</strong> Time based</p>
            </div>
            <p><span class="step-number">5</span> Tap <span class="highlight">Add</span></p>
          </div>

          <div class="section">
            <h3><span class="emoji">🔐</span> Next Time You Login</h3>
            <p><span class="step-number">1</span> Enter your email and password</p>
            <p><span class="step-number">2</span> You'll be asked for a <span class="highlight">6-digit code</span></p>
            <p><span class="step-number">3</span> Open Google Authenticator app</p>
            <p><span class="step-number">4</span> Look for <span class="highlight">Portfolio Admin</span></p>
            <p><span class="step-number">5</span> Enter the code → Login successful! 🎉</p>
          </div>

          <a href="${req.headers.origin || 'https://your-portfolio.vercel.app'}/auth" class="button">
            🔐 Go to Login Page
          </a>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('2FA activation error:', error);
    res.status(500).send(`<h1>Error: ${error.message}</h1>`);
  }
});

// One-click 2FA setup for admin
router.get('/setup-admin-2fa', async (req, res) => {
  const adminEmail = 'fahmiduxxaman@gmail.com';
  
  try {
    // Step 1: Check and add 2FA columns if needed
    const [columns] = await pool.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(col => col.Field);
    
    if (!columnNames.includes('two_factor_secret')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL');
    }
    if (!columnNames.includes('two_factor_enabled')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE');
    }
    if (!columnNames.includes('two_factor_backup_codes')) {
      await pool.query('ALTER TABLE users ADD COLUMN two_factor_backup_codes JSON DEFAULT NULL');
    }

    // Step 2: Get admin user
    const [users] = await pool.query(
      'SELECT id, email, two_factor_enabled, two_factor_secret FROM users WHERE email = ?',
      [adminEmail]
    );

    if (users.length === 0) {
      return res.status(404).send('<h1>Admin user not found</h1>');
    }

    const user = users[0];

    // If already enabled, show status
    if (user.two_factor_enabled) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>2FA Status</title></head>
        <body style="font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h1>✅ 2FA Already Enabled</h1>
          <p>Two-factor authentication is already active for ${adminEmail}</p>
          <p>When you login, you'll be prompted for the 6-digit code from Google Authenticator.</p>
        </body>
        </html>
      `);
    }

    // Step 3: Generate secret
    const secret = speakeasy.generateSecret({
      name: `Portfolio Admin (${adminEmail})`,
      issuer: 'Portfolio'
    });

    // Step 4: Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Step 5: Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }

    // Step 6: Save and enable 2FA
    await pool.query(
      'UPDATE users SET two_factor_secret = ?, two_factor_enabled = TRUE, two_factor_backup_codes = ? WHERE id = ?',
      [secret.base32, JSON.stringify(backupCodes), user.id]
    );

    // Step 7: Show success page with QR code
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>2FA Setup Complete</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 700px; margin: 30px auto; padding: 20px; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #28a745; }
          .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
          .qr-code { max-width: 300px; border: 3px solid #333; padding: 15px; background: white; border-radius: 10px; }
          .secret { background: #e9ecef; padding: 15px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 15px 0; }
          .backup-codes { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .codes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
          .code-item { background: white; padding: 10px; border-radius: 5px; font-family: monospace; font-weight: bold; }
          .warning { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
          .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
          .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #007bff; }
          button { background: #007bff; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px 5px; }
          button:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔐 Two-Factor Authentication Enabled!</h1>
          
          <div class="success">
            <strong>✅ SUCCESS!</strong> 2FA is now active for ${adminEmail}
          </div>

          <div class="step">
            <h3>📱 Step 1: Scan QR Code</h3>
            <p>Open <strong>Google Authenticator</strong> on your phone and scan this code:</p>
            <div class="qr-section">
              <img src="${qrCode}" alt="QR Code" class="qr-code" />
            </div>
          </div>

          <div class="step">
            <h3>🔑 Step 2: Manual Entry (if needed)</h3>
            <p>Can't scan? Enter this secret manually:</p>
            <div class="secret">${secret.base32}</div>
          </div>

          <div class="backup-codes">
            <h3>⚠️ IMPORTANT: Save Your Backup Codes</h3>
            <p>Keep these codes safe! Each can be used once if you lose your phone:</p>
            <div class="codes-grid">
              ${backupCodes.map((code, i) => `<div class="code-item">${i + 1}. ${code}</div>`).join('')}
            </div>
            <button onclick="copyBackupCodes()">📋 Copy All Codes</button>
            <button onclick="downloadBackupCodes()">💾 Download Codes</button>
          </div>

          <div class="warning">
            <strong>🚨 Next Steps:</strong>
            <ol>
              <li>Scan the QR code with Google Authenticator NOW</li>
              <li>Save your backup codes in a secure location</li>
              <li>Test login: You'll be asked for the 6-digit code</li>
            </ol>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.location.href='/auth'">🔐 Go to Login</button>
          </div>
        </div>

        <script>
          const backupCodes = ${JSON.stringify(backupCodes)};
          
          function copyBackupCodes() {
            const text = backupCodes.map((code, i) => \`\${i + 1}. \${code}\`).join('\\n');
            navigator.clipboard.writeText(text).then(() => {
              alert('✅ Backup codes copied to clipboard!');
            });
          }

          function downloadBackupCodes() {
            const text = \`Portfolio Admin 2FA Backup Codes\\n\\nEmail: ${adminEmail}\\nDate: \${new Date().toLocaleString()}\\n\\nBackup Codes:\\n\${backupCodes.map((code, i) => \`\${i + 1}. \${code}\`).join('\\n')}\\n\\nKeep these codes safe! Each can only be used once.\`;
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '2fa-backup-codes.txt';
            a.click();
            alert('✅ Backup codes downloaded!');
          }
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).send(`
      <h1>Setup Failed</h1>
      <p>Error: ${error.message}</p>
      <p>Please check server logs.</p>
    `);
  }
});

module.exports = router;
