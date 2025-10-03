#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎌 AniDojo Hero Image Setup');
console.log('============================\n');

console.log('To add your One Piece image:');
console.log('1. Save your image as "one-piece-hero.jpg"');
console.log('2. Place it in the public/images/ folder');
console.log('3. The file should be at: public/images/one-piece-hero.jpg\n');

console.log('Current public/images/ directory:');
try {
  const files = fs.readdirSync('./public/images/');
  if (files.length === 0) {
    console.log('❌ No images found in public/images/');
    console.log('   Add your image file to see it in the hero section!');
  } else {
    console.log('✅ Found images:');
    files.forEach(file => console.log(`   - ${file}`));
  }
} catch (error) {
  console.log('❌ Error reading images directory:', error.message);
}

console.log('\n📝 Quick setup:');
console.log('1. Copy your One Piece image to: public/images/one-piece-hero.jpg');
console.log('2. Update src/app/page.tsx to use: animeBackgrounds.onePiece');
console.log('3. Refresh your browser to see the image!');
