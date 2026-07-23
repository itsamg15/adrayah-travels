const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('backup'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    let hasH1 = false;
    let prevLevel = 0;
    let issues = [];
    
    headings.forEach(h => {
        const level = parseInt(h.tagName[1]);
        if (level === 1) hasH1 = true;
        
        if (prevLevel > 0 && level > prevLevel + 1) {
            issues.push(`Skipped heading level from H${prevLevel} to H${level}`);
            
            // Auto fix: Just change the tagName
            // This is a naive fix, might break styles if styles target specific tags, 
            // but Tailwind classes are usually applied directly. 
            // Let's not auto-fix yet, just report.
        }
        
        prevLevel = level;
    });
    
    if (!hasH1) issues.push("Missing H1");
    
    if (issues.length > 0) {
        console.log(`\nFile: ${file}`);
        issues.forEach(i => console.log(`  - ${i}`));
    }
});
