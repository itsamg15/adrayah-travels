const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    // 1. Replace the explore icon with the proper logo
    const logoRegex = /<div class="w-10 h-10 rounded-full border border-white\/30 flex items-center justify-center flex-shrink-0">\s*<span class="material-symbols-outlined text-\[20px\] text-white\/80">explore<\/span>\s*<\/div>/g;
    const properLogo = '<img alt="Adrayah Travels Logo" class="h-12 w-12 object-contain bg-white rounded-full p-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMy1YSouma0Zi_lb3P35GbxDZLIXerJdyZu7fTYeDucNe3ULgdW5KXkeyHdJVbUyX3ou5UCPnFS1IA_o5Ovklt5uG-Yu2UNS5f_04Crh38ovVLj5FHHSFZPvQhyNp4LK0x9iFWu1wdn4NsEnkbbO6I3rvybolURSKa7BHva3kC-IiDaqPZelESqQphOn3ruDHrXFFDRWkP8U9RwbjjEa4-w-kwethfoaXGhZupxw70rIMWa_t5JZRwJ2xadj2SdfRjHuf_CXTKau8">';
    
    content = content.replace(logoRegex, properLogo);

    // 2. Replace the mojibake tagline
    // It looks like: <p class="font-body-sm text-sm mt-1 text-white/90">à¤…à¤¦à¥ à¤µà¤¯: - à¤šà¤²à¥‹ à¤šà¤²à¥‡à¤‚....</p>
    const taglineRegex = /<p class="font-body-sm text-sm mt-1 text-white\/90">.*?<\/p>/;
    const properTagline = '<p class="font-body-sm text-sm mt-1 text-white/90">अद्वय: - चलो चलें....</p>';
    
    // We only want to replace the first occurrence of this class (which is the tagline), 
    // or specifically the one before "Crafting unforgettable journeys"
    content = content.replace(taglineRegex, (match, offset, string) => {
        // If it's the one right before the "Crafting" text, replace it.
        // Actually, just replace the first match since it's the only one with this exact class in the footer brand column.
        return properTagline;
    });

    if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Updated footer in ${file}`);
    }
});
