const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

const startMarkerIndex = indexHtml.indexOf('<!-- TopNavBar -->');
const heroMarkerIndex = indexHtml.indexOf('</aside>') + '</aside>'.length;

if (startMarkerIndex === -1 || heroMarkerIndex === -1) {
    console.error("Could not find markers in index.html");
    process.exit(1);
}

const exactHeader = indexHtml.substring(startMarkerIndex, heroMarkerIndex);

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    if (file === 'index.html' || file === 'index_backup.html') return;

    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    const fileStart = content.indexOf('<!-- TopNavBar -->');
    const fileEnd = content.indexOf('</aside>') + '</aside>'.length;
    
    if (fileStart !== -1 && content.indexOf('</aside>') !== -1) {
        const before = content.substring(0, fileStart);
        const after = content.substring(fileEnd);
        content = before + exactHeader + after;
        
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Replaced header in ${file}`);
    } else {
        console.log(`Warning: Could not find markers in ${file}, skipping header replacement.`);
    }
});
