#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎣 FishTrip Setup Script');
console.log('========================\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Mencipta fail .env...');
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ Fail .env dicipta. Sila edit dengan maklumat database anda.\n');
} else {
  console.log('✅ Fail .env sudah wujud.\n');
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.log('❌ Node.js versi 18+ diperlukan. Versi semasa:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js versi:', nodeVersion, '\n');

try {
  console.log('📦 Memasang dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies berjaya dipasang.\n');

  console.log('🔧 Menjana Prisma client...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  console.log('✅ Prisma client berjaya dijana.\n');

  console.log('🎯 Setup selesai!');
  console.log('\nLangkah seterusnya:');
  console.log('1. Edit fail .env dengan maklumat database anda');
  console.log('2. Pastikan PostgreSQL berjalan');
  console.log('3. Jalankan: npm run db:migrate');
  console.log('4. Jalankan: npm run db:seed');
  console.log('5. Jalankan: npm run dev');
  console.log('\nAkaun ujian:');
  console.log('Email: test@cubaje.my');
  console.log('Password: P@ssword1234');

} catch (error) {
  console.error('❌ Ralat semasa setup:', error.message);
  process.exit(1);
}