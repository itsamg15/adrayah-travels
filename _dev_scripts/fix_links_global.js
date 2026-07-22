const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // We will use replaceAll for global replace.
    content = content.replaceAll('data-nav="Special Tours" href="#"', 'data-nav="Special Tours" href="special-tours.html"');
    
    // Also, there might be other occurrences like in the mobile menu where data-nav is not present but href="#"
    // Let's replace the mobile menu occurrence too if it still has #.
    // The mobile menu link is: <a href="#" class="font-body-md text-[15px] text-white/80 hover:text-white transition-colors">Special Tours</a>
    // Just to be safe, we will replace any href="#" that wraps "Special Tours"
    content = content.replaceAll('href="#" class="font-body-md text-[15px] text-white/80 hover:text-white transition-colors">Special Tours</a>', 'href="special-tours.html" class="font-body-md text-[15px] text-white/80 hover:text-white transition-colors">Special Tours</a>');
    
    fs.writeFileSync(file, content);
});
console.log('Fixed links in all files globally.');
