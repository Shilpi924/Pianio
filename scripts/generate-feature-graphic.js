import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateFeatureGraphic() {
  const playstoreDir = path.join(process.cwd(), 'playstore-assets');
  
  // Create SVG for feature graphic
  const svg = `
    <svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f472b6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1024" height="500" fill="url(#grad1)" />
      <text x="512" y="250" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">Pianio</text>
      <text x="512" y="320" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" dominant-baseline="middle">Learn Piano with Fun Lessons</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(1024, 500)
    .toFile(path.join(playstoreDir, 'feature-graphic-1024x500.png'));

  console.log('Feature graphic generated successfully.');
}

generateFeatureGraphic().catch(console.error);
