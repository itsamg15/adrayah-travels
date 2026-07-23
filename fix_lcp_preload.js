const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('backup'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find the first hero image (either fetchpriority="high" or inside hero-slides / absolute inset-0)
    let lcpImg = document.querySelector('img[fetchpriority="high"]') || 
                 document.querySelector('.hero-slide img, img.absolute.inset-0.w-full.h-full');
                 
    if (lcpImg) {
        // Ensure it doesn't have lazy loading
        lcpImg.removeAttribute('loading');
        lcpImg.setAttribute('fetchpriority', 'high');
        
        const srcset = lcpImg.getAttribute('srcset');
        const sizes = lcpImg.getAttribute('sizes');
        const src = lcpImg.getAttribute('src');
        
        // Remove existing preload links
        const existingPreloads = document.querySelectorAll('link[rel="preload"][as="image"]');
        existingPreloads.forEach(p => p.remove());
        
        // Create new preload link
        const preloadLink = document.createElement('link');
        preloadLink.setAttribute('rel', 'preload');
        preloadLink.setAttribute('as', 'image');
        if (srcset) {
            preloadLink.setAttribute('imagesrcset', srcset);
            preloadLink.setAttribute('imagesizes', sizes);
        } else {
            preloadLink.setAttribute('href', src);
        }
        
        document.head.appendChild(preloadLink);
    }
    
    // Write back HTML
    fs.writeFileSync(filePath, dom.serialize(), 'utf8');
    console.log(`Updated LCP preload for ${file}`);
});
