const redis = require('redis');

let redisClient = null;
let isRedisAvailable = false;
let connectionAttempted = false;

async function createRedisClient() {
  if (connectionAttempted) {
    return redisClient;
  }
  
  connectionAttempted = true;

  // Skip Redis if not configured (allows app to work without Redis)
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    console.log('⚠️  Redis not configured - using in-memory cache (app will work normally)');
    console.log('💡 To enable Redis: Set REDIS_URL or REDIS_HOST in your .env file');
    return null;
  }

  try {
    // Build Redis configuration
    const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}`;
    const isSecure = redisUrl.startsWith('rediss://');
    
    console.log(`🔄 Attempting to connect to Redis...`);
    
    const redisConfig = {
      url: redisUrl,
      socket: {
        connectTimeout: 10000,
        // Enable TLS for Redis Cloud with proper settings
        tls: isSecure,
        rejectUnauthorized: false, // Required for Redis Cloud
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('⚠️  Redis connection failed after 3 retries - falling back to in-memory cache');
            isRedisAvailable = false;
            return false; // Stop reconnecting
          }
          console.log(`⚠️  Redis reconnect attempt ${retries}/3...`);
          return Math.min(retries * 100, 3000);
        }
      },
      // Add password if provided separately
      ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD })
    };

    const client = redis.createClient(redisConfig);

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err.message);
      isRedisAvailable = false;
    });

    client.on('connect', () => {
      console.log('🔗 Redis connection established');
    });

    client.on('ready', () => {
      console.log('✅ Redis client ready and operational');
      isRedisAvailable = true;
    });

    client.on('end', () => {
      console.log('⚠️  Redis connection closed');
      isRedisAvailable = false;
    });

    client.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    await client.connect();
    
    // Test the connection
    await client.ping();
    console.log('✅ Redis ping successful');
    
    redisClient = client;
    isRedisAvailable = true;
    return client;
  } catch (error) {
    console.error('⚠️  Failed to initialize Redis:', error.message);
    console.log('ℹ️  App will continue with in-memory cache');
    isRedisAvailable = false;
    redisClient = null;
    return null;
  }
}

// Initialize Redis (non-blocking)
createRedisClient().catch(err => {
  console.log('⚠️  Redis initialization failed, continuing with in-memory cache');
});

function getRedisClient() {
  return isRedisAvailable && redisClient ? redisClient : null;
}

function isRedisReady() {
  return isRedisAvailable && redisClient && redisClient.isOpen;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (redisClient && redisClient.isOpen) {
    console.log('Closing Redis connection...');
    await redisClient.quit();
  }
});

module.exports = {
  getRedisClient,
  isRedisReady,
  createRedisClient
};
