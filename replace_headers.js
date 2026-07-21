const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

const startMarkerIndex = indexHtml.indexOf('<!-- TopNavBar -->');
const heroMarkerIndex = indexHtml.indexOf('<!-- Hero Section -->');

if (startMarkerIndex === -1 || heroMarkerIndex === -1) {
    console.error("Could not find markers in index.html");
    process.exit(1);
}

const exactHeader = indexHtml.substring(startMarkerIndex, heroMarkerIndex).trim() + '\n';

const files = [
    'north-india.html',
    'south-india.html',
    'east-india.html',
    'west-india.html',
    'kashmir-escape.html',
    'himachal-explorer.html',
    'kerala-retreat.html',
    'meghalaya-discovery.html',
    'rajasthan-royal-circuit.html'
];

const startMarkers = [
    '<!-- Top Contact Strip -->',
    '<!-- Contact Strip -->',
    '<!-- TopNavBar -->'
];

const endMarkers = [
    '<!-- Hero Banner -->',
    '<!-- Hero Section -->',
    '<!-- Hero Slideshow -->',
    '<!-- Content Wrapper -->',
    '<!-- Main Content Grid -->',
    '<!-- Main Content Canvas -->',
    '<!-- BottomNavBar (Mobile) -->',
    '<main',
    '<header class="relative' // Some pages use <header for the hero
];

let count = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    let bestStart = -1;
    for (const marker of startMarkers) {
        const idx = content.indexOf(marker);
        if (idx !== -1 && (bestStart === -1 || idx < bestStart)) {
            bestStart = idx;
        }
    }
    
    let bestEnd = -1;
    for (const marker of endMarkers) {
        const idx = content.indexOf(marker, bestStart + 10);
        if (idx !== -1 && (bestEnd === -1 || idx < bestEnd)) {
            bestEnd = idx;
        }
    }
    
    if (bestStart !== -1 && bestEnd !== -1) {
        const before = content.substring(0, bestStart);
        const after = content.substring(bestEnd);
        content = before + exactHeader + after;
        fs.writeFileSync(file, content);
        console.log(`Replaced header in ${file}`);
        count++;
    } else {
        console.error(`Could not find boundaries for ${file}: start=${bestStart}, end=${bestEnd}`);
    }
}

console.log(`Total files updated: ${count}`);
