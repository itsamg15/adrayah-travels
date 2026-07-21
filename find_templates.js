const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// The markers to find specific sections
const findSection = (query) => {
    const idx = content.indexOf(query);
    if (idx === -1) return "Not found: " + query;
    const end = content.indexOf('</section>', idx) + 10;
    return content.substring(idx - 100, end);
};

console.log("Trending Packages:");
console.log(findSection('Trending Packages').substring(0, 500) + '...');

console.log("\nThe Adrayah Difference:");
console.log(findSection('The Adrayah Difference').substring(0, 500) + '...');

console.log("\nTraveler Stories:");
console.log(findSection('What Our Travelers Say').substring(0, 500) + '...');

console.log("\nExplore India by Region:");
console.log(findSection('Explore India by Region').substring(0, 500) + '...');

