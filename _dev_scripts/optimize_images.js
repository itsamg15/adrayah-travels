const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;
    let preloadedSrc = null;

    // 1. Find hero section and first image
    const heroStart = content.indexOf('<!-- Hero Section -->');
    if (heroStart !== -1) {
        const heroEnd = content.indexOf('</section>', heroStart);
        if (heroEnd !== -1) {
            const heroBlock = content.substring(heroStart, heroEnd);
            const firstImgMatch = heroBlock.match(/<img[^>]+src="([^"]+)"/);
            const firstBgMatch = heroBlock.match(/background-image:\s*url\(['"]([^'"]+)['"]\)/);
            
            if (firstImgMatch && firstImgMatch[1]) {
                preloadedSrc = firstImgMatch[1];
            } else if (firstBgMatch && firstBgMatch[1]) {
                preloadedSrc = firstBgMatch[1];
            }
            
            if (preloadedSrc) {
                // Add to head if not present
                const preloadTag = `    <link rel="preload" as="image" href="${preloadedSrc}">`;
                if (!content.includes(preloadTag)) {
                    content = content.replace('</head>', `${preloadTag}\n</head>`);
                }
            }
        }
    }

    // 2. Add loading="lazy" to all images that don't have it, except the logo and the preloaded hero image
    content = content.replace(/<img([^>]+)>/g, (match, attrs) => {
        if (attrs.includes('loading="lazy"')) return match;
        if (attrs.includes('alt="Adrayah Travels Logo"')) return match;
        
        // If it's the hero image we just preloaded, DO NOT lazy load it!
        // That would defeat the purpose of preloading and hurt LCP.
        if (preloadedSrc && attrs.includes(`src="${preloadedSrc}"`)) {
            // We can optionally add fetchpriority="high" here to boost LCP even more
            if (!attrs.includes('fetchpriority="high"')) {
                return `<img fetchpriority="high"${attrs}>`;
            }
            return match;
        }
        
        // Ensure formatting has a space before existing attributes
        return `<img loading="lazy" ${attrs.trim()}>`;
    });

    if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Optimized images in ${file}`);
    }
});
