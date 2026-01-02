const pool = require('../config/database');

/**
 * Keep Aiven database connection alive by pinging it periodically
 * Prevents the free tier from pausing after 24 hours of inactivity
 */

let keepAliveInterval = null;

async function pingDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    console.log('✅ Database keep-alive ping successful:', new Date().toLocaleString());
  } catch (error) {
    console.error('❌ Database keep-alive ping failed:', error.message);
  }
}

/**
 * Start the keep-alive service
 * @param {number} intervalHours - How often to ping (in hours). Default: 12 hours
 */
function startKeepAlive(intervalHours = 12) {
  // Clear any existing interval
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }

  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  console.log(`🔄 Database keep-alive service started (pinging every ${intervalHours} hours)`);
  
  // Initial ping
  pingDatabase();
  
  // Set up recurring pings
  keepAliveInterval = setInterval(pingDatabase, intervalMs);
}

/**
 * Stop the keep-alive service
 */
function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('⏸️  Database keep-alive service stopped');
  }
}

module.exports = {
  startKeepAlive,
  stopKeepAlive,
  pingDatabase
};
