// Quick test to check co_curricular_activities table structure
require('dotenv').config();
const pool = require('./src/config/database');

async function checkTable() {
  try {
    console.log('\n=== Checking co_curricular_activities table ===\n');
    
    // Check table structure
    const [columns] = await pool.query('DESCRIBE co_curricular_activities');
    console.log('Table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    // Check data
    console.log('\n=== Current data ===\n');
    const [rows] = await pool.query('SELECT * FROM co_curricular_activities');
    console.log(`Total records: ${rows.length}`);
    
    if (rows.length > 0) {
      console.log('\nSample record:');
      console.log(JSON.stringify(rows[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkTable();
