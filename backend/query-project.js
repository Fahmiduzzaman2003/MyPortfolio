const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    const [rows] = await conn.query(
      "SELECT title, live_url, github_url FROM projects WHERE title LIKE '%signal%' OR title LIKE '%Viz%'"
    );
    
    console.log(JSON.stringify(rows, null, 2));
    await conn.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
