import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const svgPath = path.join(rootDir, 'packages/web/public/favicon.svg');
const webPublic = path.join(rootDir, 'packages/web/public');
const extIconsDir = path.join(rootDir, 'packages/extension/public/icons');

fs.mkdirSync(webPublic, { recursive: true });
fs.mkdirSync(extIconsDir, { recursive: true });

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

console.log('Building favicons and PWA icons from favicon.svg...');

// Create a temporary HTML file for rendering each resolution cleanly via headless Chrome
const tempHtmlPath = path.join(rootDir, 'temp_render.html');

for (const { name, size } of sizes) {
  const outputPath = path.join(webPublic, name);
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${size}px; height: ${size}px; background: transparent; overflow: hidden; }
    img { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <img src="file://${svgPath.replace(/\\/g, '/')}" />
</body>
</html>`;

  fs.writeFileSync(tempHtmlPath, htmlContent);

  try {
    execFileSync(
      chromePath,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--default-background-color=00000000',
        `--window-size=${size},${size}`,
        `--screenshot=${outputPath}`,
        `file://${tempHtmlPath.replace(/\\/g, '/')}`,
      ],
      { stdio: 'pipe' }
    );
    console.log(`Generated ${name} (${size}x${size})`);
  } catch (err) {
    console.error(`Error rendering ${name}:`, err.message);
  }
}

// Generate Chrome Extension icons
const extSizes = [
  { name: 'icon16.png', size: 16 },
  { name: 'icon48.png', size: 48 },
  { name: 'icon128.png', size: 128 },
];

for (const { name, size } of extSizes) {
  const outputPath = path.join(extIconsDir, name);
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${size}px; height: ${size}px; background: transparent; overflow: hidden; }
    img { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <img src="file://${svgPath.replace(/\\/g, '/')}" />
</body>
</html>`;

  fs.writeFileSync(tempHtmlPath, htmlContent);

  try {
    execFileSync(
      chromePath,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--default-background-color=00000000',
        `--window-size=${size},${size}`,
        `--screenshot=${outputPath}`,
        `file://${tempHtmlPath.replace(/\\/g, '/')}`,
      ],
      { stdio: 'pipe' }
    );
    console.log(`Generated extension icon ${name} (${size}x${size})`);
  } catch (err) {
    console.error(`Error rendering ${name}:`, err.message);
  }
}

// Clean up temp file
if (fs.existsSync(tempHtmlPath)) {
  fs.unlinkSync(tempHtmlPath);
}

// Create binary multi-size favicon.ico containing 16x16, 32x32, 48x48
function createIcoFromPngs(pngPaths, outputPath) {
  const pngBuffers = pngPaths.map((p) => fs.readFileSync(p));
  const count = pngBuffers.length;

  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type (1 = ICO)
  header.writeUInt16LE(count, 4); // Image count

  const directoryEntries = [];
  let currentOffset = 6 + count * 16;

  for (let i = 0; i < count; i++) {
    const buf = pngBuffers[i];
    // Read PNG width & height (bytes 16-24 of PNG header)
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);

    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0); // Width
    entry.writeUInt8(height >= 256 ? 0 : height, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8); // Size of image data
    entry.writeUInt32LE(currentOffset, 12); // Offset

    directoryEntries.push(entry);
    currentOffset += buf.length;
  }

  const icoBuffer = Buffer.concat([header, ...directoryEntries, ...pngBuffers]);
  fs.writeFileSync(outputPath, icoBuffer);
  console.log(`Created multi-size favicon.ico (${icoBuffer.length} bytes)`);
}

const icoSources = [
  path.join(webPublic, 'favicon-16x16.png'),
  path.join(webPublic, 'favicon-32x32.png'),
  path.join(webPublic, 'favicon-48x48.png'),
];

if (icoSources.every((p) => fs.existsSync(p))) {
  createIcoFromPngs(icoSources, path.join(webPublic, 'favicon.ico'));
}

console.log('Favicon generation completed successfully.');
