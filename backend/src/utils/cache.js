const { getRedisClient, isRedisReady } = require('../config/redis');

// In-memory cache as fallback when Redis is unavailable
const memoryCache = new Map();
const cacheExpiry = new Map();

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Cached data or null if not found
 */
async function get(key) {
  try {
    // Try Redis first
    if (isRedisReady()) {
      const client = getRedisClient();
      const data = await client.get(key);
      if (data) {
        return JSON.parse(data);
      }
    }
    
    // Fallback to memory cache
    if (memoryCache.has(key)) {
      const expiry = cacheExpiry.get(key);
      if (expiry && Date.now() > expiry) {
        // Expired
        memoryCache.delete(key);
        cacheExpiry.delete(key);
        return null;
      }
      return memoryCache.get(key);
    }
    
    return null;
  } catch (error) {
    console.error('Cache get error:', error.message);
    return null;
  }
}

/**
 * Set cached data
 * @param {string} key - Cache key
 * @param {any} value - Data to cache
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 */
async function set(key, value, ttl = 300) {
  try {
    // Try Redis first
    if (isRedisReady()) {
      const client = getRedisClient();
      await client.setEx(key, ttl, JSON.stringify(value));
    }
    
    // Always set in memory cache as backup
    memoryCache.set(key, value);
    cacheExpiry.set(key, Date.now() + (ttl * 1000));
  } catch (error) {
    console.error('Cache set error:', error.message);
    // Fallback to memory cache only
    memoryCache.set(key, value);
    cacheExpiry.set(key, Date.now() + (ttl * 1000));
  }
}

/**
 * Delete cached data
 * @param {string} key - Cache key or pattern
 */
async function del(key) {
  try {
    // Try Redis first
    if (isRedisReady()) {
      const client = getRedisClient();
      
      // If key contains wildcard, delete all matching keys
      if (key.includes('*')) {
        const keys = await client.keys(key);
        if (keys.length > 0) {
          await client.del(keys);
        }
      } else {
        await client.del(key);
      }
    }
    
    // Delete from memory cache
    if (key.includes('*')) {
      const pattern = key.replace(/\*/g, '.*');
      const regex = new RegExp(pattern);
      for (const cacheKey of memoryCache.keys()) {
        if (regex.test(cacheKey)) {
          memoryCache.delete(cacheKey);
          cacheExpiry.delete(cacheKey);
        }
      }
    } else {
      memoryCache.delete(key);
      cacheExpiry.delete(key);
    }
  } catch (error) {
    console.error('Cache delete error:', error.message);
  }
}

/**
 * Clear all cache
 */
async function clear() {
  try {
    if (isRedisReady()) {
      const client = getRedisClient();
      await client.flushDb();
    }
    memoryCache.clear();
    cacheExpiry.clear();
  } catch (error) {
    console.error('Cache clear error:', error.message);
  }
}

/**
 * Cache middleware for Express routes
 * @param {number} ttl - Time to live in seconds
 */
function cacheMiddleware(ttl = 300) {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `api:${req.originalUrl}`;
    
    try {
      const cachedData = await get(cacheKey);
      
      if (cachedData) {
        // Add cache header
        res.set('X-Cache', 'HIT');
        return res.json(cachedData);
      }
      
      // Store original json function
      const originalJson = res.json.bind(res);
      
      // Override json function to cache the response
      res.json = (data) => {
        // Cache the response
        set(cacheKey, data, ttl).catch(err => {
          console.error('Failed to cache response:', err.message);
        });
        
        // Add cache header
        res.set('X-Cache', 'MISS');
        
        // Call original json function
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      next();
    }
  };
}

// Clean up expired memory cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, expiry] of cacheExpiry.entries()) {
    if (expiry && now > expiry) {
      memoryCache.delete(key);
      cacheExpiry.delete(key);
    }
  }
}, 60000); // Clean every minute

module.exports = {
  get,
  set,
  del,
  clear,
  cacheMiddleware
};
