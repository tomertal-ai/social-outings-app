const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../assets/venues/logos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const size = 128;
const center = size / 2;
const radius = 36;

// Build a simple radial gradient approximation using SVG
const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7B61FF"/>
      <stop offset="100%" stop-color="#D946EF"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="#161622"/>
  <circle cx="${center}" cy="${center}" r="${radius}" fill="url(#g)"/>
  <path d="M ${center - 12} ${center - 4} L ${center} ${center - 14} L ${center + 12} ${center - 4} M ${center} ${center - 14} L ${center} ${center + 16}" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const venues = [
  'placeholder',
  'the-block',
  'haoman-17',
  'alphabet',
  'roxanne',
  'atlanta',
];

Promise.all(
  venues.map(name =>
    sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `${name}.png`))
      .then(() => console.log(`Created ${name}.png`))
  )
).then(() => console.log('Done'));
