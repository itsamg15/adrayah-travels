const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    // Replace just "Adrayah" with "Adrayah Travels" in the mobile header specifically.
    // The previous structure was: <span class="font-headline-md text-headline-md font-bold text-primary text-xl">Adrayah</span></a>
    
    // Using a regex to accurately match and replace
    const targetString = /<span class="font-headline-md text-headline-md font-bold text-primary text-xl">Adrayah<\/span><\/a>/g;
    // We add 'truncate whitespace-nowrap' and allow it to shrink slightly on small screens if necessary
    const replacementString = '<span class="font-headline-md text-headline-md font-bold text-primary text-lg sm:text-xl truncate whitespace-nowrap tracking-tight">Adrayah Travels</span></a>';

    content = content.replace(targetString, replacementString);

    if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Updated mobile brand name for ${file}`);
    }
});
