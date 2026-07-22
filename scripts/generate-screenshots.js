import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateScreenshots() {
  const playstoreDir = path.join(process.cwd(), 'playstore-assets');
  const screenshotsDir = path.join(playstoreDir, 'screenshots');
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const screenshots = [
    { name: 'home-screen', title: 'Home Screen', subtitle: 'Choose your learning path' },
    { name: 'lesson-player', title: 'Lesson Player', subtitle: 'Follow the falling notes' },
    { name: 'settings', title: 'Settings', subtitle: 'Customize your experience' },
    { name: 'achievements', title: 'Achievements', subtitle: 'Track your progress' },
  ];

  for (const screenshot of screenshots) {
    const svg = `
      <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f7fbff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fef7ed;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1080" height="1920" fill="url(#grad)" />
        <rect x="0" y="0" width="1080" height="100" fill="#ec4899" />
        <text x="540" y="70" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">Pianio</text>
        <rect x="100" y="300" width="880" height="400" rx="20" fill="white" stroke="#ec4899" stroke-width="4" />
        <text x="540" y="500" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#333" text-anchor="middle">${screenshot.title}</text>
        <text x="540" y="560" font-family="Arial, sans-serif" font-size="28" fill="#666" text-anchor="middle">${screenshot.subtitle}</text>
        <rect x="100" y="800" width="880" height="400" rx="20" fill="white" stroke="#f472b6" stroke-width="4" />
        <text x="540" y="1000" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#333" text-anchor="middle">Interactive Piano</text>
        <text x="540" y="1060" font-family="Arial, sans-serif" font-size="28" fill="#666" text-anchor="middle">Learn with falling notes</text>
        <rect x="100" y="1300" width="880" height="400" rx="20" fill="white" stroke="#a855f7" stroke-width="4" />
        <text x="540" y="1500" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#333" text-anchor="middle">Progress Tracking</text>
        <text x="540" y="1560" font-family="Arial, sans-serif" font-size="28" fill="#666" text-anchor="middle">Earn achievements and XP</text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .resize(1080, 1920)
      .toFile(path.join(screenshotsDir, `${screenshot.name}-1080x1920.png`));
  }

  console.log('Screenshots generated successfully.');
  console.log('NOTE: These are placeholder screenshots. For actual Play Store submission, you need to take real screenshots of the running app.');
}

generateScreenshots().catch(console.error);
