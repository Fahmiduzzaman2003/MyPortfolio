// Auto-fix co_curricular_activities table structure
require('dotenv').config();
const pool = require('./src/config/database');

async function fixTable() {
  try {
    console.log('\n=== Fixing co_curricular_activities table ===\n');
    
    // Step 1: Add new column
    console.log('1. Adding club_logo_url column...');
    await pool.query(`
      ALTER TABLE co_curricular_activities 
      ADD COLUMN club_logo_url VARCHAR(500) AFTER role
    `);
    console.log('✓ Column added');
    
    // Step 2: Copy data
    console.log('2. Copying data from image_url to club_logo_url...');
    await pool.query(`
      UPDATE co_curricular_activities 
      SET club_logo_url = image_url 
      WHERE image_url IS NOT NULL
    `);
    console.log('✓ Data copied');
    
    // Step 3: Drop old columns
    console.log('3. Dropping old columns...');
    await pool.query(`
      ALTER TABLE co_curricular_activities 
      DROP COLUMN image_url
    `);
    await pool.query(`
      ALTER TABLE co_curricular_activities 
      DROP COLUMN description
    `);
    await pool.query(`
      ALTER TABLE co_curricular_activities 
      DROP COLUMN year
    `);
    console.log('✓ Old columns removed');
    
    // Step 4: Verify
    console.log('\n4. Verifying changes...');
    const [columns] = await pool.query('DESCRIBE co_curricular_activities');
    console.log('\nNew table structure:');
    columns.forEach(col => {
      console.log(`  ✓ ${col.Field} (${col.Type})`);
    });
    
    console.log('\n✅ Table fixed successfully!');
    console.log('\nPlease restart your backend server now.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Duplicate column')) {
      console.log('\n⚠️ Column already exists. Trying alternative method...');
      try {
        await pool.query(`
          ALTER TABLE co_curricular_activities 
          DROP COLUMN image_url,
          DROP COLUMN description,
          DROP COLUMN year
        `);
        console.log('✅ Old columns removed successfully!');
      } catch (e) {
        console.error('❌ Alternative method failed:', e.message);
      }
    }
  } finally {
    process.exit(0);
  }
}

fixTable();
