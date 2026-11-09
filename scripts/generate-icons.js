import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// LifeSync SVG Icon with Lavender, Purple, Sky Blue, and Soft Peach accents
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <linearGradient id="peachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa" />
      <stop offset="100%" stop-color="#fb923c" />
    </linearGradient>
    <linearGradient id="lavenderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e0e7ff" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#312e81" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background rounded rect -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)" />

  <!-- Subtle glow ring -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="rgba(255, 255, 255, 0.15)" stroke-width="4" stroke-dasharray="12 12" />

  <!-- Main Balance & Well-being Symbol (Stylized Lotus / Synced Leaves + Academic Star) -->
  <g filter="url(#shadow)">
    <!-- Left Leaf (Study & Mind) -->
    <path d="M 256 120 C 180 180 140 260 170 340 C 200 400 248 370 256 360 C 256 280 256 200 256 120 Z" fill="url(#lavenderGrad)" opacity="0.95" />
    
    <!-- Right Leaf (Rest & Health) -->
    <path d="M 256 120 C 332 180 372 260 342 340 C 312 400 264 370 256 360 C 256 280 256 200 256 120 Z" fill="url(#lavenderGrad)" opacity="0.85" />

    <!-- Center Warm Pulse (Heart/Peach Harmony) -->
    <path d="M 256 210 C 235 250 215 295 240 335 C 248 350 256 352 256 352 C 256 352 264 350 272 335 C 297 295 277 250 256 210 Z" fill="url(#peachGrad)" />

    <!-- Radiant Top Core dot -->
    <circle cx="256" cy="155" r="18" fill="#fef08a" />
  </g>

  <!-- Small floating wellness satellites -->
  <circle cx="140" cy="190" r="14" fill="#fed7aa" opacity="0.9" />
  <circle cx="372" cy="190" r="14" fill="#a7f3d0" opacity="0.9" />
  <circle cx="256" cy="410" r="10" fill="#ffffff" opacity="0.8" />
</svg>
`;

// Maskable SVG with safe zone padding (15% all around)
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <linearGradient id="peachGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa" />
      <stop offset="100%" stop-color="#fb923c" />
    </linearGradient>
    <linearGradient id="lavenderGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e0e7ff" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background -->
  <rect width="512" height="512" fill="url(#bgGradMask)" />

  <!-- Centered safe zone scaled down to 70% -->
  <g transform="translate(76.8, 76.8) scale(0.7)">
    <circle cx="256" cy="256" r="190" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="4" stroke-dasharray="12 12" />

    <path d="M 256 120 C 180 180 140 260 170 340 C 200 400 248 370 256 360 C 256 280 256 200 256 120 Z" fill="url(#lavenderGradMask)" opacity="0.95" />
    <path d="M 256 120 C 332 180 372 260 342 340 C 312 400 264 370 256 360 C 256 280 256 200 256 120 Z" fill="url(#lavenderGradMask)" opacity="0.85" />
    <path d="M 256 210 C 235 250 215 295 240 335 C 248 350 256 352 256 352 C 256 352 264 350 272 335 C 297 295 277 250 256 210 Z" fill="url(#peachGradMask)" />
    <circle cx="256" cy="155" r="18" fill="#fef08a" />
    <circle cx="140" cy="190" r="14" fill="#fed7aa" opacity="0.9" />
    <circle cx="372" cy="190" r="14" fill="#a7f3d0" opacity="0.9" />
    <circle cx="256" cy="410" r="10" fill="#ffffff" opacity="0.8" />
  </g>
</svg>
`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write base SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());

  // Render 512x512 standard PNG
  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Render 192x192 standard PNG
  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // Render 180x180 Apple touch icon
  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Render 512x512 Maskable PNG
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Render favicon.png (64x64) and favicon.ico
  await sharp(Buffer.from(svgIcon))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  await sharp(Buffer.from(svgIcon))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Successfully generated all PWA icons: 192, 512, maskable, apple-touch, favicon.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
