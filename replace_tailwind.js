const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index_backup.html');

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove Tailwind CDN
    content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com\?plugins=forms,container-queries"><\/script>\s*/g, '');
    
    // Remove tailwind config script
    const scriptStart = content.indexOf('<script id="tailwind-config">');
    if (scriptStart !== -1) {
        const scriptEnd = content.indexOf('</script>', scriptStart) + '</script>'.length;
        content = content.substring(0, scriptStart) + content.substring(scriptEnd);
    }
    
    // Insert new stylesheet if not exists
    if (!content.includes('assets/css/style.css')) {
        const insertPos = content.indexOf('</head>');
        if (insertPos !== -1) {
            content = content.substring(0, insertPos) + '    <link rel="stylesheet" href="assets/css/style.css">\n' + content.substring(insertPos);
        }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
