const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let count = 0;
const target = '<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-20 bg-glass-surface backdrop-blur-md shadow-sm border-b border-glass-border hidden md:flex">';
const replacement = '<header class="fixed top-9 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-20 bg-glass-surface backdrop-blur-md shadow-sm border-b border-glass-border hidden md:flex">';

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(f, content);
        count++;
        console.log('Fixed ' + f);
    }
});
console.log('Total fixed: ' + count);
