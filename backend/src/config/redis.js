const redis = require('redis');

let redisClient = null;
let isRedisAvailable = false;

async function createRedisClient() {
  // Skip Redis if not configured (allows app to work without Redis)
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    console.log('⚠️  Redis not configured - caching disabled (app will work normally)');
    return null;
  }

  try {
    // Build Redis configuration
    const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}`;
    const isSecure = redisUrl.startsWith('rediss://');
    
    const redisConfig = {
      url: redisUrl,
      socket: {
        connectTimeout: 10000,
        // Enable TLS for Redis Cloud with proper settings
        tls: isSecure,
        rejectUnauthorized: false, // Required for Redis Cloud
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('⚠️  Redis connection failed - disabling cache');
            isRedisAvailable = false;
            return false; // Stop reconnecting
          }
          return Math.min(retries * 100, 3000);
        }
      }
    };

    const client = redis.createClient(redisConfig);

    client.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
      isRedisAvailable = false;
    });

    client.on('connect', () => {
      console.log('✅ Redis connected successfully');
      isRedisAvailable = true;
    });

    client.on('ready', () => {
      console.log('✅ Redis client ready');
      isRedisAvailable = true;
    });

    client.on('end', () => {
      console.log('⚠️  Redis connection closed');
      isRedisAvailable = false;
    });

    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    console.error('⚠️  Failed to initialize Redis:', error.message);
    console.log('ℹ️  App will continue without caching');
    isRedisAvailable = false;
    return null;
  }
}

// Initialize Redis (non-blocking)
createRedisClient().catch(err => {
  console.log('⚠️  Redis initialization failed, continuing without cache');
});

function getRedisClient() {
  return isRedisAvailable ? redisClient : null;
}

function isRedisReady() {
  return isRedisAvailable && redisClient && redisClient.isOpen;
}

module.exports = {
  getRedisClient,
  isRedisReady
};
