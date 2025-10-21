// Simple script to generate placeholder PWA icons
// In a real project, you would use proper icon generation tools

const fs = require('fs');
const path = require('path');

const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for each size
iconSizes.forEach(size => {
  const svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" fill="white" text-anchor="middle" dominant-baseline="central">🎣</text>
</svg>`.trim();

  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svgContent);
  
  // Also create PNG versions (placeholder - in real project use proper image conversion)
  const pngFilename = `icon-${size}x${size}.png`;
  fs.writeFileSync(path.join(iconsDir, pngFilename), svgContent); // This is just a placeholder
});

console.log('Generated placeholder PWA icons');