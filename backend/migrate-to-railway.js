const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function migrateToRailway() {
  console.log('🚀 Starting Railway Migration...\n');

  try {
    // Connect to Railway MySQL
    console.log('📡 Connecting to Railway MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('✅ Connected successfully!\n');

    // Read and execute schema
    console.log('📋 Creating database schema...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    await connection.query(schema);
    console.log('✅ Schema created!\n');

    // Read and execute initial data
    console.log('📊 Importing initial data...');
    const initDataPath = path.join(__dirname, 'database', 'init-data.sql');
    const initData = await fs.readFile(initDataPath, 'utf8');
    await connection.query(initData);
    console.log('✅ Initial data imported!\n');

    // Check tables
    console.log('📝 Verifying tables...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    await connection.end();
    console.log('\n✨ Migration completed successfully!');
    console.log('\n📌 Next steps:');
    console.log('1. Check Railway dashboard to verify tables');
    console.log('2. Update your frontend .env with new API URL');
    console.log('3. Test your application');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Verify your .env file has Railway database credentials');
    console.error('2. Ensure Railway MySQL service is running');
    console.error('3. Check if database exists on Railway');
    process.exit(1);
  }
}

// Run migration
migrateToRailway();
