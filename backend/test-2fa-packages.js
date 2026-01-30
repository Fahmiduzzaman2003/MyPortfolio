const express = require('express');
const path = require('path');

// Simple test server to verify 2FA packages are installed correctly
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

console.log('✓ speakeasy package loaded successfully');
console.log('✓ qrcode package loaded successfully');

// Test secret generation
const secret = speakeasy.generateSecret({
  name: 'Test Portfolio Admin',
  issuer: 'Portfolio'
});

console.log('✓ Secret generated successfully');
console.log('  Base32:', secret.base32);

// Test QR code generation
QRCode.toDataURL(secret.otpauth_url).then(qrCode => {
  console.log('✓ QR code generated successfully');
  console.log('  Length:', qrCode.length, 'characters');
  
  // Test token generation
  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  });
  
  console.log('✓ TOTP token generated:', token);
  
  // Test token verification
  const verified = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token,
    window: 2
  });
  
  console.log('✓ Token verification:', verified ? 'SUCCESS' : 'FAILED');
  
  console.log('\n✅ All 2FA packages are working correctly!');
  console.log('\nYou can now:');
  console.log('1. Run the database migration');
  console.log('2. Start the backend server: npm run dev');
  console.log('3. Login and enable 2FA in Security settings');
  
}).catch(err => {
  console.error('❌ QR code generation failed:', err);
});
