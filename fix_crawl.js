const fs = require('fs');
const dir = './';
fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/href="javascript:void\(0\)"/g, 'href="#"');
    fs.writeFileSync(f, content, 'utf8');
});
