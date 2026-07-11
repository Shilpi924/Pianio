import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'favicon.svg'));

  await sharp(svgBuffer)
    .resize(192, 192)
    .toFile(path.join(process.cwd(), 'public', 'pwa-192x192.png'));

  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile(path.join(process.cwd(), 'public', 'pwa-512x512.png'));
    
  await sharp(svgBuffer)
    .resize(180, 180)
    .toFile(path.join(process.cwd(), 'public', 'apple-touch-icon.png'));
    
  console.log('Icons generated successfully.');
}

generateIcons().catch(console.error);
