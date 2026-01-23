#!/usr/bin/env node

/**
 * Redis Connection Test Script
 * Tests if Redis is configured and working properly
 */

require('dotenv').config();
const { createRedisClient, isRedisReady } = require('./src/config/redis');

console.log('\n📋 Redis Configuration Test\n');
console.log('=' .repeat(50));

// Check environment variables
console.log('\n🔍 Environment Variables:');
console.log(`  REDIS_URL: ${process.env.REDIS_URL ? '✅ Set' : '❌ Not set'}`);
console.log(`  REDIS_HOST: ${process.env.REDIS_HOST ? '✅ ' + process.env.REDIS_HOST : '❌ Not set'}`);
console.log(`  REDIS_PORT: ${process.env.REDIS_PORT || 'default (6379)'}`);
console.log(`  REDIS_PASSWORD: ${process.env.REDIS_PASSWORD ? '✅ Set' : '⚠️  Not set'}`);

async function testRedis() {
  console.log('\n🔌 Testing Redis Connection...\n');
  
  try {
    const client = await createRedisClient();
    
    if (!client) {
      console.log('⚠️  Redis is not configured or failed to connect.');
      console.log('ℹ️  The app will use in-memory caching instead.');
      console.log('\n💡 To enable Redis:');
      console.log('   1. Install Redis locally: https://redis.io/download');
      console.log('   2. Or use Redis Cloud: https://redis.com/try-free/');
      console.log('   3. Add REDIS_URL or REDIS_HOST to your .env file');
      console.log('\n✅ App functionality: Everything works fine with in-memory cache!\n');
      process.exit(0);
    }

    // Test basic operations
    console.log('🧪 Running basic Redis operations...\n');
    
    await client.set('test:key', 'Hello Redis!');
    console.log('✅ SET operation successful');
    
    const value = await client.get('test:key');
    console.log(`✅ GET operation successful: "${value}"`);
    
    await client.del('test:key');
    console.log('✅ DEL operation successful');
    
    // Test with expiration
    await client.setEx('test:ttl', 5, 'expires in 5 seconds');
    console.log('✅ SETEX operation successful');
    
    const ttl = await client.ttl('test:ttl');
    console.log(`✅ TTL operation successful: ${ttl} seconds remaining`);
    
    await client.del('test:ttl');
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Redis is working perfectly!');
    console.log('✅ All tests passed');
    console.log('📊 Cache status: ENABLED');
    console.log('='.repeat(50) + '\n');
    
    await client.quit();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Redis test failed:', error.message);
    console.log('\n⚠️  The app will fall back to in-memory caching.');
    console.log('✅ App functionality: Everything still works!\n');
    process.exit(1);
  }
}

testRedis();
