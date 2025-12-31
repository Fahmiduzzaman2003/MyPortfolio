require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkProfile() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'portfolio_db'
  });

  const [rows] = await connection.query('SELECT * FROM profiles LIMIT 1');
  
  if (rows.length > 0) {
    console.log('\n=== PROFILE DATA IN DATABASE ===');
    console.log('Full Name:', rows[0].full_name);
    console.log('Profile Photo URL:', rows[0].profile_photo_url);
    console.log('CV URL:', rows[0].cv_url);
    console.log('Tagline:', rows[0].tagline);
    console.log('Short Intro:', rows[0].short_intro);
    console.log('\nFull Row:');
    console.log(JSON.stringify(rows[0], null, 2));
  } else {
    console.log('No profile found in database!');
  }

  await connection.end();
}

checkProfile().catch(console.error);
