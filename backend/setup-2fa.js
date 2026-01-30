const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('Connected! Running 2FA migration...');

    // Add 2FA columns if they don't exist
    try {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL,
        ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE,
        ADD COLUMN two_factor_backup_codes JSON DEFAULT NULL
      `);
      console.log('✓ 2FA columns added successfully');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ 2FA columns already exist');
      } else {
        throw error;
      }
    }

    // Check if admin user exists
    const [users] = await connection.query(
      'SELECT email, two_factor_enabled FROM users WHERE email = ?',
      ['fahmiduxxaman@gmail.com']
    );

    if (users.length > 0) {
      console.log(`✓ Admin user found: fahmiduxxaman@gmail.com`);
      console.log(`  2FA Status: ${users[0].two_factor_enabled ? 'ENABLED' : 'NOT ENABLED'}`);
    } else {
      console.log('⚠ Admin user not found. Creating admin user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.query(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        ['fahmiduxxaman@gmail.com', hashedPassword, 'admin']
      );
      console.log('✓ Admin user created with temporary password: admin123');
      console.log('  PLEASE CHANGE THIS PASSWORD IMMEDIATELY!');
    }

    console.log('\n✓ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Login with fahmiduxxaman@gmail.com');
    console.log('3. Go to Admin panel > Security Settings to setup 2FA');
    console.log('4. Scan QR code with Google Authenticator app');

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
