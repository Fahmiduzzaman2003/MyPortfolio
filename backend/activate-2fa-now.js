const mysql = require('mysql2/promise');
require('dotenv').config();

async function enableTwoFactorAuth() {
  const adminEmail = 'fahmiduxxaman@gmail.com';
  const secret = 'LBCEERCTIB2FIVDFNNBSSJTCOEVECMBYJYQWELT2OY2DUYZELIXQ';
  
  console.log('Connecting to database...');
  
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

    console.log('✓ Connected!\n');

    // Step 1: Add columns if they don't exist
    console.log('Step 1: Adding 2FA columns...');
    
    const [columns] = await connection.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(col => col.Field);
    
    if (!columnNames.includes('two_factor_secret')) {
      await connection.query('ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL');
      console.log('  ✓ Added: two_factor_secret');
    } else {
      console.log('  • two_factor_secret already exists');
    }
    
    if (!columnNames.includes('two_factor_enabled')) {
      await connection.query('ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE');
      console.log('  ✓ Added: two_factor_enabled');
    } else {
      console.log('  • two_factor_enabled already exists');
    }
    
    if (!columnNames.includes('two_factor_backup_codes')) {
      await connection.query('ALTER TABLE users ADD COLUMN two_factor_backup_codes JSON DEFAULT NULL');
      console.log('  ✓ Added: two_factor_backup_codes');
    } else {
      console.log('  • two_factor_backup_codes already exists');
    }

    // Step 2: Check user exists
    console.log('\nStep 2: Checking user...');
    const [users] = await connection.query(
      'SELECT id, email FROM users WHERE email = ?',
      [adminEmail]
    );

    if (users.length === 0) {
      console.error('❌ User not found:', adminEmail);
      process.exit(1);
    }

    console.log('  ✓ User found:', adminEmail);

    // Step 3: Enable 2FA
    console.log('\nStep 3: Enabling 2FA...');
    await connection.query(
      'UPDATE users SET two_factor_secret = ?, two_factor_enabled = TRUE WHERE email = ?',
      [secret, adminEmail]
    );

    console.log('  ✓ 2FA enabled!\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ SUCCESS! 2FA is now active for your account');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📱 NOW ADD TO GOOGLE AUTHENTICATOR APP:');
    console.log('─────────────────────────────────────────────────────\n');
    console.log('1. Open Google Authenticator app');
    console.log('2. Tap the "+" button');
    console.log('3. Select "Enter a setup key"');
    console.log('4. Enter these details:');
    console.log('   ');
    console.log('   Account name: Portfolio Admin');
    console.log('   Your key: ' + secret);
    console.log('   Type: Time based');
    console.log('   ');
    console.log('5. Tap "Add"\n');

    console.log('🔐 NEXT TIME YOU LOGIN:');
    console.log('─────────────────────────────────────────────────────\n');
    console.log('1. Enter your email and password');
    console.log('2. You\'ll be asked for a 6-digit code');
    console.log('3. Open Google Authenticator');
    console.log('4. Enter the code for "Portfolio Admin"');
    console.log('5. Login successful! 🎉\n');

  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('\nCannot connect to database. Check:');
      console.error('- Internet connection');
      console.error('- .env file has correct database credentials');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✓ Database connection closed\n');
    }
  }
}

enableTwoFactorAuth();
