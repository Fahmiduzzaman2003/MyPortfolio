const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  console.log('Connecting to Aiven MySQL database...');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('Database:', process.env.DB_NAME);
  
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 30000
    });

    console.log('✓ Connected to database successfully!\n');

    // Check if columns already exist
    console.log('Checking existing columns...');
    const [columns] = await connection.query('SHOW COLUMNS FROM users');
    const existingColumns = columns.map(col => col.Field);
    
    const hasSecret = existingColumns.includes('two_factor_secret');
    const hasEnabled = existingColumns.includes('two_factor_enabled');
    const hasBackup = existingColumns.includes('two_factor_backup_codes');

    if (hasSecret && hasEnabled && hasBackup) {
      console.log('✓ 2FA columns already exist!');
    } else {
      console.log('Adding 2FA columns...');
      
      if (!hasSecret) {
        await connection.query('ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL');
        console.log('  ✓ Added: two_factor_secret');
      }
      
      if (!hasEnabled) {
        await connection.query('ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE');
        console.log('  ✓ Added: two_factor_enabled');
      }
      
      if (!hasBackup) {
        await connection.query('ALTER TABLE users ADD COLUMN two_factor_backup_codes JSON DEFAULT NULL');
        console.log('  ✓ Added: two_factor_backup_codes');
      }
    }

    // Verify the changes
    console.log('\nVerifying columns...');
    const [updatedColumns] = await connection.query('SHOW COLUMNS FROM users');
    const twoFactorCols = updatedColumns.filter(col => col.Field.includes('two_factor'));
    
    if (twoFactorCols.length === 3) {
      console.log('✓ All 2FA columns present:');
      twoFactorCols.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });
    }

    // Check admin user
    console.log('\nChecking admin user...');
    const [users] = await connection.query(
      'SELECT email, role, two_factor_enabled FROM users WHERE email = ?',
      ['fahmiduxxaman@gmail.com']
    );

    if (users.length > 0) {
      console.log('✓ Admin user exists:');
      console.log(`  Email: ${users[0].email}`);
      console.log(`  Role: ${users[0].role}`);
      console.log(`  2FA Enabled: ${users[0].two_factor_enabled ? 'Yes' : 'No'}`);
    } else {
      console.log('⚠ Admin user not found');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Push your code changes to GitHub');
    console.log('2. Render will auto-deploy the backend');
    console.log('3. Login to admin panel');
    console.log('4. Go to Security settings to enable 2FA');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('\nConnection error: Cannot reach database server');
      console.error('Please check:');
      console.error('- Your internet connection');
      console.error('- Database host in .env file');
      console.error('- Firewall/VPN settings');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nAuthentication failed');
      console.error('Please verify DB_PASSWORD in .env file');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Database connection closed');
    }
  }
}

runMigration();
