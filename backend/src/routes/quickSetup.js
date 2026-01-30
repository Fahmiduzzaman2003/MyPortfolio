const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const pool = require('../config/database');

const router = express.Router();

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
