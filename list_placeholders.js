const fs = require('fs');
const content = fs.readFileSync('special-tours.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<img') && lines[i].includes('assets/images/placeholder')) {
        // Look ahead for the title
        let title = '';
        for (let j = i; j < i + 10; j++) {
            if (lines[j] && lines[j].includes('<h3')) {
                title = lines[j].replace(/<[^>]*>?/gm, '').trim();
                break;
            }
        }
        console.log(`Title: ${title} - Image: ${lines[i].match(/src="([^"]+)"/)[1]}`);
    }
}
