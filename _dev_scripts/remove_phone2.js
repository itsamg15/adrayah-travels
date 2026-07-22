const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    content = content.replace(/<p class="font-title-lg text-title-lg text-primary">\+91 7982037419<\/p>/g, '');
    content = content.replace(/<p class="font-body-md text-sm text-on-surface-variant">\+91 7982037419<\/p>/g, '');
    content = content.replace(/<p[^>]*>\+91 7982037419<\/p>/g, '');
    content = content.replace(/<span[^>]*>\+91 7982037419<\/span>/g, '');
    
    // Also remove the entire contact card wrapper if it becomes empty or just to be safe
    // Since the previous regex removed the phone number, maybe there is an empty <a> tag?
    content = content.replace(/<a class="flex items-center gap-3 p-2 hover:bg-surface-muted rounded-lg transition-colors"[^>]*>\s*<span class="material-symbols-outlined text-primary text-\[24px\]">call<\/span>\s*<\/a>/g, '');
    
    if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Cleaned up stray numbers in ${file}`);
    }
});
