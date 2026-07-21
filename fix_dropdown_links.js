const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const replacements = [
    // North India
    {
        target: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="#"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Himachal Pradesh</p><span class="text-xs text-on-surface-variant">- Mountains &amp; Adventure</span></div></a>',
        replacement: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="himachal-explorer.html"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Himachal Pradesh</p><span class="text-xs text-on-surface-variant">- Mountains &amp; Adventure</span></div></a>'
    },
    {
        target: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="#"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Kashmir</p><span class="text-xs text-on-surface-variant">- Paradise on Earth</span></div></a>',
        replacement: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="kashmir-escape.html"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Kashmir</p><span class="text-xs text-on-surface-variant">- Paradise on Earth</span></div></a>'
    },
    // South India
    {
        target: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="#"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Kerala</p><span class="text-xs text-on-surface-variant">- Backwaters &amp; Hills</span></div></a>',
        replacement: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="kerala-retreat.html"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Kerala</p><span class="text-xs text-on-surface-variant">- Backwaters &amp; Hills</span></div></a>'
    },
    // East India
    {
        target: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="#"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Meghalaya</p><span class="text-xs text-on-surface-variant">- Waterfalls &amp; Living Root Bridges</span></div></a>',
        replacement: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="meghalaya-discovery.html"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Meghalaya</p><span class="text-xs text-on-surface-variant">- Waterfalls &amp; Living Root Bridges</span></div></a>'
    },
    // West India
    {
        target: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="#"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Rajasthan</p><span class="text-xs text-on-surface-variant">- Forts &amp; Royal Palaces</span></div></a>',
        replacement: '<a class="flex items-center p-3 rounded-xl hover:bg-surface-muted transition-colors" href="rajasthan-royal-circuit.html"><div class="flex items-baseline gap-2"><p class="font-bold text-primary">Rajasthan</p><span class="text-xs text-on-surface-variant">- Forts &amp; Royal Palaces</span></div></a>'
    }
];

let filesModified = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const rep of replacements) {
        // Global replace using split/join to handle exact strings reliably
        content = content.split(rep.target).join(rep.replacement);
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
        filesModified++;
    }
}

console.log(`Finished. Modified ${filesModified} files.`);
