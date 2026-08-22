const fs = require('fs');
const path = require('path');

const directory = __dirname;
const targetFiles = [
    '404.html',
    'contact.html',
    'east-india.html',
    'himachal-explorer.html',
    'index.html',
    'kashmir-escape.html',
    'kerala-retreat.html',
    'meghalaya-discovery.html',
    'north-india.html',
    'rajasthan-royal-circuit.html',
    'south-india.html',
    'special-tours.html',
    'west-india.html',
    'setup_seo.js'
];

targetFiles.forEach(file => {
    const filePath = path.join(directory, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace all instances of the URL but NOT the email address
        // The regex looks for https://adrayahtravels.com
        const newContent = content.replace(/https:\/\/adrayahtravels\.com/g, 'https://adrayah-travels.vercel.app');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.warn(`File not found: ${file}`);
    }
});
console.log('All files updated successfully.');
