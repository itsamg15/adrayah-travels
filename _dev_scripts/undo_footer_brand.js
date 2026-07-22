const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    const targetString = /<div class="font-headline-md text-\[28px\] font-bold tracking-wide">Adrayah Travels<\/div>/g;
    const replacementString = '<div class="font-headline-md text-[28px] font-bold tracking-wide">Adrayah</div>';

    content = content.replace(targetString, replacementString);

    if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Reverted footer brand name for ${file}`);
    }
});
