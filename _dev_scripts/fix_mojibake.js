const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    // The corrupt character is 'ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢' which represents a bullet point in testimonials
    const corruptBullet = /ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢/g;
    content = content.replace(corruptBullet, '•');

    if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Replaced corrupt bullet in ${file}`);
    }
});
