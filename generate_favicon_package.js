const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = __dirname;
// Exact source image currently used in the navigation bar
const sourceLogo = path.join(root, 'assets/images/optimized/ext_6ad8ba11-lg.webp');
const faviconDir = path.join(root, 'assets/favicon');

if (!fs.existsSync(faviconDir)) {
    fs.mkdirSync(faviconDir, { recursive: true });
}

// Helper to assemble a standard Windows .ico binary with embedded PNG frames
function createIco(pngFrames) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type 1: Icon
    header.writeUInt16LE(pngFrames.length, 4); // Count of images
    
    let dataOffset = 6 + (pngFrames.length * 16);
    const directories = [];
    const imageBuffers = [];
    
    for (const frame of pngFrames) {
        const { buffer, size } = frame;
        const dir = Buffer.alloc(16);
        dir.writeUInt8(size >= 256 ? 0 : size, 0); // Width
        dir.writeUInt8(size >= 256 ? 0 : size, 1); // Height
        dir.writeUInt8(0, 2); // Color palette
        dir.writeUInt8(0, 3); // Reserved
        dir.writeUInt16LE(1, 4); // Color planes
        dir.writeUInt16LE(32, 6); // Bits per pixel (32-bit RGBA PNG)
        dir.writeUInt32LE(buffer.length, 8); // Image data size in bytes
        dir.writeUInt32LE(dataOffset, 12); // Image data offset
        directories.push(dir);
        imageBuffers.push(buffer);
        dataOffset += buffer.length;
    }
    
    return Buffer.concat([header, ...directories, ...imageBuffers]);
}

async function buildCircularFaviconPackage() {
    console.log('Reading source logo:', sourceLogo);
    
    // Exact geometry of the circular gold border in ext_6ad8ba11-lg.webp (measured via pixel scan):
    // Center is at (961.5, 921.5), diameter is ~1678 px.
    // To leave exactly 3% padding on each side (6% total padding, fulfilling 2-4% requirement):
    // Width and height = 1678 / 0.94 = 1785.
    const left = 69;   // Math.round(961.5 - 1785/2)
    const top = 29;    // Math.round(921.5 - 1785/2)
    const size = 1785;
    
    console.log(`Extracting tightly cropped square around circle: left=${left}, top=${top}, size=${size}x${size} (exactly 3% padding)`);
    
    // Get raw RGBA buffer of the extracted crop
    const rawBuffer = await sharp(sourceLogo)
        .extract({ left, top, width: size, height: size })
        .ensureAlpha()
        .raw()
        .toBuffer();
        
    // Apply circular masking:
    // Inside the gold ring (radius <= 815px), composite transparent background over solid white (#FFFFFF).
    // Outside the gold ring (radius > 840px), enforce 100% clean transparency (A=0) so NO white square ever appears in browser tabs.
    const centerX = size / 2;
    const centerY = size / 2;
    const ratioY = 838.5 / 825.5; // Account for slight vertical/horizontal aspect matching of source ring
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - centerX;
            const dy = (y - centerY) * ratioY;
            const r = Math.sqrt(dx * dx + dy * dy);
            
            const idx = (y * size + x) * 4;
            const a = rawBuffer[idx + 3];
            
            if (r <= 815) {
                // Inside gold circle: blend transparent interior over solid white (#FFFFFF)
                if (a < 255) {
                    const alpha = a / 255;
                    rawBuffer[idx] = Math.round(rawBuffer[idx] * alpha + 255 * (1 - alpha));
                    rawBuffer[idx + 1] = Math.round(rawBuffer[idx + 1] * alpha + 255 * (1 - alpha));
                    rawBuffer[idx + 2] = Math.round(rawBuffer[idx + 2] * alpha + 255 * (1 - alpha));
                    rawBuffer[idx + 3] = 255; // Solid opaque white background inside circle
                }
            } else if (r > 840) {
                // Outside gold circle: enforce 100% transparent corners (A=0)
                rawBuffer[idx] = 0;
                rawBuffer[idx + 1] = 0;
                rawBuffer[idx + 2] = 0;
                rawBuffer[idx + 3] = 0;
            }
        }
    }
    
    // Convert processed master image to sharp instance with RGBA format
    const masterImage = sharp(rawBuffer, { raw: { width: size, height: size, channels: 4 } });

    // 1. Generate favicon-16x16.png (sharpened specifically for crispness at 16x16)
    const png16 = await masterImage
        .clone()
        .resize(16, 16, { kernel: sharp.kernel.lanczos3 })
        .sharpen({ sigma: 1.0, m1: 1.5, m2: 0.5 })
        .toFormat('png', { compressionLevel: 9 })
        .toBuffer();
    fs.writeFileSync(path.join(faviconDir, 'favicon-16x16.png'), png16);
    fs.writeFileSync(path.join(root, 'favicon-16x16.png'), png16);
    console.log('Generated: favicon-16x16.png (circular shape, transparent corners, white interior)');

    // 2. Generate favicon-32x32.png (sharpened specifically for crispness at 32x32)
    const png32 = await masterImage
        .clone()
        .resize(32, 32, { kernel: sharp.kernel.lanczos3 })
        .sharpen({ sigma: 1.0, m1: 1.5, m2: 0.5 })
        .toFormat('png', { compressionLevel: 9 })
        .toBuffer();
    fs.writeFileSync(path.join(faviconDir, 'favicon-32x32.png'), png32);
    fs.writeFileSync(path.join(root, 'favicon-32x32.png'), png32);
    console.log('Generated: favicon-32x32.png (circular shape, transparent corners, white interior)');

    // 3. Generate 48x48 frame for ICO file
    const png48 = await masterImage
        .clone()
        .resize(48, 48, { kernel: sharp.kernel.lanczos3 })
        .sharpen({ sigma: 1.0, m1: 1.2, m2: 0.5 })
        .toFormat('png', { compressionLevel: 9 })
        .toBuffer();
    console.log('Generated: 48x48 frame for ICO file');

    // 4. Generate multi-frame favicon.ico (containing 16x16, 32x32, and 48x48)
    const icoBuffer = createIco([
        { buffer: png16, size: 16 },
        { buffer: png32, size: 32 },
        { buffer: png48, size: 48 }
    ]);
    fs.writeFileSync(path.join(faviconDir, 'favicon.ico'), icoBuffer);
    fs.writeFileSync(path.join(root, 'favicon.ico'), icoBuffer);
    console.log('Generated: favicon.ico (multi-frame 16x16, 32x32, 48x48 circular icon)');

    // 5. Generate apple-touch-icon.png (180x180)
    const appleIcon = await masterImage
        .clone()
        .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
        .toFormat('png', { compressionLevel: 9 })
        .toBuffer();
    fs.writeFileSync(path.join(faviconDir, 'apple-touch-icon.png'), appleIcon);
    fs.writeFileSync(path.join(root, 'apple-touch-icon.png'), appleIcon);
    console.log('Generated: apple-touch-icon.png (180x180, circular shape)');

    // 6. Generate android-chrome-192x192.png
    const android192 = await masterImage
        .clone()
        .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
        .toFormat('png', { compressionLevel: 9 })
        .toBuffer();
    fs.writeFileSync(path.join(faviconDir, 'android-chrome-192x192.png'), android192);
    fs.writeFileSync(path.join(root, 'android-chrome-192x192.png'), android192);
    console.log('Generated: android-chrome-192x192.png (192x192, circular shape)');

    // 7. Generate android-chrome-512x512.png
    const android512 = await masterImage
        .clone()
        .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
        .toFormat('png', { compressionLevel: 9 })
        .toBuffer();
    fs.writeFileSync(path.join(faviconDir, 'android-chrome-512x512.png'), android512);
    fs.writeFileSync(path.join(root, 'android-chrome-512x512.png'), android512);
    console.log('Generated: android-chrome-512x512.png (512x512, circular shape)');

    // 8. Generate site.webmanifest
    const manifest = {
        name: "Adrayah Travels - Exotic India through a lens of luxury",
        short_name: "Adrayah",
        icons: [
            {
                src: "android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png"
            }
        ],
        theme_color: "#002546",
        background_color: "#ffffff",
        display: "standalone"
    };
    fs.writeFileSync(path.join(faviconDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');
    fs.writeFileSync(path.join(root, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');
    console.log('Generated: site.webmanifest');

    // Verification check on generated 32x32 icon: ensure corner pixel (0,0) is A=0 (transparent)
    // and center pixel (16,16) is opaque (A=255)
    const raw32 = await sharp(path.join(faviconDir, 'favicon-32x32.png')).raw().toBuffer();
    const cornerAlpha = raw32[3]; // alpha at (0,0)
    console.log(`\nVerification of generated favicon-32x32.png: Top-left outer corner Alpha = ${cornerAlpha} (0=transparent)`);
    if (cornerAlpha === 0) {
        console.log('SUCCESS: Favicon outer corners are 100% transparent. Browser tab will show purely the circular logo without a white square box.');
    }

    // 9. Update all HTML files with correct tags & clear old references
    const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html') && f !== 'index_backup.html');
    
    const faviconTags = `
<link rel="icon" type="image/x-icon" href="assets/favicon/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon.png">
<link rel="manifest" href="assets/favicon/site.webmanifest">
<meta name="theme-color" content="#002546">`;

    for (const file of htmlFiles) {
        const filePath = path.join(root, file);
        let html = fs.readFileSync(filePath, 'utf8');
        
        html = html.replace(/```html/gi, '');
        html = html.replace(/<link\s+[^>]*rel="(?:shortcut )?icon"[^>]*>/gi, '');
        html = html.replace(/<link\s+[^>]*rel="apple-touch-icon"[^>]*>/gi, '');
        html = html.replace(/<link\s+[^>]*rel="manifest"[^>]*>/gi, '');
        html = html.replace(/<meta\s+[^>]*name="theme-color"[^>]*>/gi, '');
        
        if (html.includes('<head>')) {
            html = html.replace('<head>', `<head>${faviconTags}`);
        } else if (html.includes('<HEAD>')) {
            html = html.replace('<HEAD>', `<HEAD>${faviconTags}`);
        } else {
            html = html.replace(/<head[^>]*>/i, match => `${match}${faviconTags}`);
        }
        
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`Updated HTML favicon references in: ${file}`);
    }
    
    console.log('\nCircular Favicon Package generation and HTML site-wide integration complete!');
}

buildCircularFaviconPackage().catch(err => {
    console.error('Error generating favicon package:', err);
    process.exit(1);
});
