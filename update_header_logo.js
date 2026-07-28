const fs = require('fs');
const path = require('path');
const root = __dirname;

const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));

let totalUpdated = 0;
for (const file of files) {
    if (file === 'index_backup.html') continue;
    const filepath = path.join(root, file);
    let content = fs.readFileSync(filepath, 'utf8');
    
    // We want to update the above-the-fold logo (in header/nav, not footer).
    // In these files, the header logos appear before <main> or before <footer>.
    // We can match <img alt="Adrayah Travels Logo" ... loading="lazy" ...> that does NOT contain 'bg-white rounded-full p-1' (which is the footer styling).
    
    // Regex to find Adrayah Travels Logo img tag
    const logoRegex = /(<img\s+[^>]*alt="Adrayah Travels Logo"[^>]*?)(loading="lazy")([^>]*>)/gi;
    
    let fileUpdated = false;
    let newContent = content.replace(logoRegex, (match, prefix, loading, suffix) => {
        // Don't modify footer logo
        if (match.includes('rounded-full') && match.includes('bg-white')) {
            return match;
        }
        fileUpdated = true;
        return `${prefix}loading="eager" fetchpriority="high"${suffix}`;
    });
    
    if (fileUpdated && newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`Updated above-the-fold logo in: ${file}`);
        totalUpdated++;
    }
}
console.log(`Total files updated with eager loading logo: ${totalUpdated}`);
