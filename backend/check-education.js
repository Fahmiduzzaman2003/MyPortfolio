const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MySQL@24',
    database: 'portfolio_db'
  });

  try {
    console.log('✅ Checking education table structure:');
    const [columns] = await pool.query('SHOW COLUMNS FROM education');
    columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));
    
    console.log('\n📊 Sample education data:');
    const [data] = await pool.query('SELECT * FROM education LIMIT 2');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
})();
