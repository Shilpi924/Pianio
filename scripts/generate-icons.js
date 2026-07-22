import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'favicon.svg'));

  // PWA icons
  await sharp(svgBuffer)
    .resize(192, 192)
    .toFile(path.join(process.cwd(), 'public', 'pwa-192x192.png'));

  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile(path.join(process.cwd(), 'public', 'pwa-512x512.png'));
    
  await sharp(svgBuffer)
    .resize(180, 180)
    .toFile(path.join(process.cwd(), 'public', 'apple-touch-icon.png'));

  // Create playstore-assets directory
  const playstoreDir = path.join(process.cwd(), 'playstore-assets');
  if (!fs.existsSync(playstoreDir)) {
    fs.mkdirSync(playstoreDir, { recursive: true });
  }

  // Play Store icon (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile(path.join(playstoreDir, 'icon-512x512.png'));

  // Android adaptive icons (foreground layer)
  const adaptiveSizes = [
    { size: 108, path: 'mipmap-mdpi' },
    { size: 162, path: 'mipmap-hdpi' },
    { size: 216, path: 'mipmap-xhdpi' },
    { size: 324, path: 'mipmap-xxhdpi' },
    { size: 432, path: 'mipmap-xxxhdpi' },
  ];

  for (const { size, path: dir } of adaptiveSizes) {
    const dirPath = path.join(playstoreDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    await sharp(svgBuffer)
      .resize(size, size)
      .toFile(path.join(dirPath, 'ic_launcher_foreground.png'));
  }

  console.log('Icons generated successfully.');
}

generateIcons().catch(console.error);
