const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MySQL@24',
    database: 'portfolio_db',
    multipleStatements: true
  });

  try {
    console.log('Connected to database...');
    
    const sqlFile = path.join(__dirname, 'database', 'add-contact-info.sql');
    const sql = await fs.readFile(sqlFile, 'utf8');
    
    console.log('Running migration...');
    await connection.query(sql);
    
    console.log('✓ Migration completed successfully!');
    console.log('✓ contact_info table created and populated with default data.');
    
    // Verify
    const [rows] = await connection.query('SELECT * FROM contact_info ORDER BY display_order');
    console.log('\nInserted contact info records:');
    rows.forEach(row => {
      console.log(`  - ${row.type}: ${row.label} - ${row.value}`);
    });
    
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
