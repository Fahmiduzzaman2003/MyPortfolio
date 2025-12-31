const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MySQL@24',
    database: 'portfolio_db'
  });

  try {
    const [columns] = await pool.query('SHOW COLUMNS FROM achievements');
    console.log('✅ Achievements table columns:');
    columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));
    
    console.log('\n📊 Sample data:');
    const [data] = await pool.query('SELECT id, title, credential_url FROM achievements LIMIT 5');
    data.forEach(row => {
      console.log(`  ID ${row.id}: ${row.title}`);
      console.log(`    credential_url: ${row.credential_url || '(empty)'}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
})();
