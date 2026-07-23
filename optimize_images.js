const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');

const dir = './';
const imgOutDir = path.join(dir, 'assets', 'images', 'optimized');
if (!fs.existsSync(imgOutDir)) fs.mkdirSync(imgOutDir, { recursive: true });

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('backup'));

async function downloadImage(url) {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        return res.data;
    } catch (e) {
        console.error(`Failed to download ${url}: ${e.message}`);
        return null;
    }
}

function getHash(str) {
    return crypto.createHash('md5').update(str).digest('hex').substring(0, 8);
}

async function processImage(buffer, baseName) {
    // Generate variants
    const sizes = [
        { suffix: '-sm', width: 640 },
        { suffix: '-md', width: 1024 },
        { suffix: '-lg', width: 1920 }
    ];
    
    // Quality 85 for good balance as requested
    const quality = 85;

    for (const size of sizes) {
        await sharp(buffer)
            .resize(size.width)
            .webp({ quality })
            .toFile(path.join(imgOutDir, `${baseName}${size.suffix}.webp`));
    }
    
    // Original size as fallback webp
    await sharp(buffer)
        .webp({ quality })
        .toFile(path.join(imgOutDir, `${baseName}.webp`));
}

(async () => {
    const urlMap = new Map(); // map old src -> baseName

    for (const file of files) {
        const filePath = path.join(dir, file);
        const html = fs.readFileSync(filePath, 'utf8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const imgs = document.querySelectorAll('img');

        for (const img of imgs) {
            let src = img.getAttribute('src');
            if (!src) continue;
            
            // Skip svg or external images we don't want to optimize
            if (src.endsWith('.svg')) continue;
            
            // Skip already optimized
            if (src.includes('/optimized/')) continue;

            let baseName;
            if (urlMap.has(src)) {
                baseName = urlMap.get(src);
            } else {
                let buffer;
                if (src.startsWith('http')) {
                    console.log(`Downloading ${src}...`);
                    buffer = await downloadImage(src);
                    baseName = `ext_${getHash(src)}`;
                } else {
                    const localPath = path.join(dir, src);
                    if (fs.existsSync(localPath)) {
                        buffer = fs.readFileSync(localPath);
                        baseName = path.parse(src).name;
                    } else {
                        console.warn(`Local file not found: ${localPath}`);
                        continue;
                    }
                }
                
                if (buffer) {
                    console.log(`Optimizing ${baseName}...`);
                    await processImage(buffer, baseName);
                    urlMap.set(src, baseName);
                } else {
                    continue;
                }
            }

            // Update img tags with srcset and new src
            img.setAttribute('src', `assets/images/optimized/${baseName}.webp`);
            img.setAttribute('srcset', `assets/images/optimized/${baseName}-sm.webp 640w, assets/images/optimized/${baseName}-md.webp 1024w, assets/images/optimized/${baseName}-lg.webp 1920w`);
            img.setAttribute('sizes', '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw');
            
            // Preload/Lazy logic will be handled in another script, but we can set default lazy
            if (!img.hasAttribute('loading') && !img.hasAttribute('fetchpriority')) {
                img.setAttribute('loading', 'lazy');
                img.setAttribute('decoding', 'async');
            }
        }
        
        // Write back HTML
        let outHtml = dom.serialize();
        // Simple hack to remove jsdom's injected html/head/body if it wrapped a snippet
        // Since we are parsing full HTML, it should be fine, but we need to ensure formatting isn't completely destroyed.
        fs.writeFileSync(filePath, outHtml, 'utf8');
        console.log(`Processed ${file}`);
    }
    
    console.log('Image optimization complete.');
})();
