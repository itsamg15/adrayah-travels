const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Find all <a ... href="#" ...> tags
    const regex = /<a[^>]*href="#"[^>]*>.*?<\/a>/gs;
    let matches = content.match(regex);
    
    if (matches) {
        matches.forEach(match => {
            if (!match.includes('onclick')) {
                console.log(`\nFile: ${file}`);
                console.log(match.replace(/\n/g, ' '));
            }
        });
    }
});
