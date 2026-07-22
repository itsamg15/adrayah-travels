const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newScript = `<script>
document.addEventListener('DOMContentLoaded', () => {
    let path = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
    path = path.replace('.html', '');
    
    const activeMap = {
        'index': 'Home',
        'north-india': 'North India',
        'kashmir-escape': 'North India',
        'himachal-explorer': 'North India',
        'south-india': 'South India',
        'kerala-retreat': 'South India',
        'east-india': 'East India',
        'meghalaya-discovery': 'East India',
        'west-india': 'West India',
        'rajasthan-royal-circuit': 'West India'
    };
    
    const activeTarget = activeMap[path];
    
    document.querySelectorAll('.nav-link').forEach(link => {
        // Reset all
        link.classList.remove('text-on-secondary-container', 'border-b-2', 'border-on-tertiary-container', 'pb-1', 'font-bold', 'hover:text-on-tertiary-container');
        link.classList.add('text-on-surface-variant', 'hover:text-primary', 'py-2');
        
        // Apply active
        if (activeTarget && link.getAttribute('data-nav') === activeTarget) {
            link.classList.remove('text-on-surface-variant', 'hover:text-primary', 'py-2');
            link.classList.add('text-on-secondary-container', 'border-b-2', 'border-on-tertiary-container', 'pb-1', 'font-bold', 'hover:text-on-tertiary-container');
        }
    });
});
</script>`;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the old script block
    const scriptRegex = /<script>\s*document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*const path = window\.location\.pathname.*?\}\);\s*<\/script>/s;
    
    if (scriptRegex.test(content)) {
        content = content.replace(scriptRegex, newScript);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`Script not found in ${file}`);
    }
}
