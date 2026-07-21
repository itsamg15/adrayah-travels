const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'special-tours.html');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace('data-nav="Special Tours" href="#"', 'data-nav="Special Tours" href="special-tours.html"');
    fs.writeFileSync(file, content);
});
console.log('Updated links in all HTML files.');
