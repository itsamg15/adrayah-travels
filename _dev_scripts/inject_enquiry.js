const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const scriptTag = '<script src="assets/js/enquiry.js"></script>';

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('assets/js/enquiry.js')) {
        // Insert right before </body> or at the end
        if (content.includes('</body>')) {
            content = content.replace('</body>', `    ${scriptTag}\n</body>`);
        } else {
            content += `\n${scriptTag}\n`;
        }
        fs.writeFileSync(file, content);
        console.log('Injected script into', file);
    }
});
