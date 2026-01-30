const speakeasy = require('speakeasy');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function enableTwoFactor() {
  const adminEmail = 'fahmiduxxaman@gmail.com';
  const verificationCode = process.argv[2];

  if (!verificationCode) {
    console.error('❌ Please provide the 6-digit code from Google Authenticator');
    console.log('Usage: node enable-2fa.js [6-digit-code]');
    process.exit(1);
  }

  if (!/^\d{6}$/.test(verificationCode)) {
    console.error('❌ Code must be exactly 6 digits');
    process.exit(1);
  }

  console.log('Verifying 2FA code for:', adminEmail);
  
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

    // Get user with secret
    const [users] = await connection.query(
      'SELECT id, email, two_factor_secret, two_factor_enabled FROM users WHERE email = ?',
      [adminEmail]
    );

    if (users.length === 0) {
      console.error('❌ User not found');
      process.exit(1);
    }

    const user = users[0];

    if (!user.two_factor_secret) {
      console.error('❌ 2FA secret not found. Run setup-admin-2fa.js first');
      process.exit(1);
    }

    if (user.two_factor_enabled) {
      console.log('✓ 2FA is already enabled for this account');
      process.exit(0);
    }

    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token: verificationCode,
      window: 2
    });

    if (!verified) {
      console.error('❌ Invalid verification code');
      console.log('Please check:');
      console.log('- The code from Google Authenticator');
      console.log('- Your phone\'s time is synced correctly');
      console.log('- Try the next code (it changes every 30 seconds)');
      process.exit(1);
    }

    console.log('✓ Code verified successfully!\n');

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }

    // Enable 2FA
    await connection.query(
      'UPDATE users SET two_factor_enabled = TRUE, two_factor_backup_codes = ? WHERE id = ?',
      [JSON.stringify(backupCodes), user.id]
    );

    console.log('✅ 2FA ENABLED SUCCESSFULLY!\n');
    console.log('📱 Your Google Authenticator is now active');
    console.log('🔐 When you login, you will be asked for the 6-digit code\n');
    
    console.log('⚠️  IMPORTANT: Save these backup codes in a safe place!');
    console.log('Each code can only be used once if you lose your phone:\n');
    
    backupCodes.forEach((code, i) => {
      console.log(`  ${(i + 1).toString().padStart(2, '0')}. ${code}`);
    });
    
    console.log('\n✓ Setup complete! You can now login with 2FA.\n');

  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

enableTwoFactor();
