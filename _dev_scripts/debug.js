const fs = require('fs');

let content = fs.readFileSync('west-india.html', 'utf8');
const heroStart = content.indexOf('<!-- Hero Section -->');
const heroEnd = content.indexOf('</section>', heroStart);
const heroBlock = content.substring(heroStart, heroEnd);
const firstImgMatch = heroBlock.match(/<img[^>]+src="([^"]+)"/);
const firstBgMatch = heroBlock.match(/background-image:\s*url\(['"]([^'"]+)['"]\)/);

console.log("IMG MATCH:", firstImgMatch ? firstImgMatch[1] : null);
console.log("BG MATCH:", firstBgMatch ? firstBgMatch[1] : null);
