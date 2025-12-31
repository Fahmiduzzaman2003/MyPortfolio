// Initialize default data in database
require('dotenv').config();
const mysql = require('mysql2/promise');

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'portfolio_db'
    });

    console.log('Connected to database...');

    // Check if profile exists
    const [profiles] = await connection.query('SELECT COUNT(*) as count FROM profiles');
    
    if (profiles[0].count === 0) {
      console.log('No profile found. Inserting default profile...');
      
      await connection.query(`
        INSERT INTO profiles (
          full_name,
          tagline,
          short_intro,
          bio,
          location,
          email,
          availability_text,
          roles,
          stats
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'Your Name',
        'Developer | Student | Enthusiast',
        'Welcome to my portfolio! I am passionate about technology and building amazing things.',
        'Add your bio here. Tell visitors about your journey, skills, and what drives you.',
        'Your Location',
        'your.email@example.com',
        'Open to work',
        '[]',
        '[]'
      ]);

      console.log('✓ Default profile created successfully!');
    } else {
      console.log('✓ Profile already exists. Skipping initialization.');
    }

    await connection.end();
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
