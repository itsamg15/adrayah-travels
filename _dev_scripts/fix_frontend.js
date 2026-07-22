const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const mobileNavScript = '\n<script src="assets/js/mobile-nav.js" defer></script>\n';

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    // 1. Fix broken script tag in index.html and ensure defer
    content = content.replace(/<script src="assets\/js\/enquiry-system\.js">\s*\/\/ Mobile Navigation Drawer.*?<\/script>/s, '<script src="assets/js/enquiry-system.js" defer></script>');
    
    // Catch cases where the script tag is literally `<script src="assets/js/enquiry-system.js">` followed by a new line of JS
    content = content.replace(/<script src="assets\/js\/enquiry-system\.js">\s*\n\s*\/\//g, '<script src="assets/js/enquiry-system.js" defer></script>\n<script>\n//');
    
    content = content.replace(/<script src="assets\/js\/enquiry-system\.js"><\/script>/g, '<script src="assets/js/enquiry-system.js" defer></script>');

    // 2. Add mobile-nav.js just before </body>
    if (!content.includes('assets/js/mobile-nav.js')) {
        content = content.replace('</body>', mobileNavScript + '</body>');
    }

    // 3. Make Adrayah Travels logo clickable in ALL headers
    // Desktop logo
    content = content.replace(
        /<div class="flex items-center gap-4 cursor-pointer scale-95 active:opacity-80 transition-transform">\s*<img alt="Adrayah Travels Logo"/g,
        '<a href="index.html" class="flex items-center gap-4 cursor-pointer scale-95 active:opacity-80 transition-transform"><img alt="Adrayah Travels Logo"'
    );
    content = content.replace(
        /<span class="font-headline-md text-headline-md font-bold text-primary">Adrayah Travels<\/span>\s*<\/div>/g,
        '<span class="font-headline-md text-headline-md font-bold text-primary">Adrayah Travels</span></a>'
    );
    
    // Mobile logo
    content = content.replace(
        /<div class="flex items-center gap-2">\s*<img alt="Adrayah Travels Logo"/g,
        '<a href="index.html" class="flex items-center gap-2"><img alt="Adrayah Travels Logo"'
    );
    content = content.replace(
        /<span class="font-headline-md text-headline-md font-bold text-primary text-xl">Adrayah<\/span>\s*<\/div>/g,
        '<span class="font-headline-md text-headline-md font-bold text-primary text-xl">Adrayah</span></a>'
    );

    // Mobile menu drawer logo
    content = content.replace(
        /<div class="flex items-center gap-3">\s*<img alt="Adrayah Travels Logo"/g,
        '<a href="index.html" class="flex items-center gap-3"><img alt="Adrayah Travels Logo"'
    );
    content = content.replace(
        /<p class="text-xs text-on-surface-variant">Explore Incredible India<\/p>\s*<\/div>\s*<\/div>/g,
        '<p class="text-xs text-on-surface-variant">Explore Incredible India</p></div></a>'
    );

    // 4. Update index.html region cards to say "Explore Region" instead of "Enquire Now"
    content = content.replace(/<button class="mt-4 bg-white\/20 hover:bg-white\/30 backdrop-blur-md text-white px-4 py-2 rounded-full font-label-md w-fit opacity-0 group-hover:opacity-100 transition-all duration-300">Enquire Now<\/button>/g, '<button class="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full font-label-md w-fit opacity-0 group-hover:opacity-100 transition-all duration-300">Explore Region</button>');

    // 5. Add loading="lazy" to images that are below the fold.
    let imgRegex = /<img\s+(?![^>]*\bloading=)([^>]*?)>/g;
    content = content.replace(imgRegex, (match, p1) => {
        if (p1.includes('slideshow-image') || p1.includes('h-12 w-12') || p1.includes('h-8 w-8') || p1.includes('h-9 w-9')) {
            return match; // Don't lazy load logos or hero slides
        }
        return `<img loading="lazy" ${p1}>`;
    });

    // 6. Fix broken links (like href="#") in Mega Menus
    // Wait, the mega menu links are in desktop and mobile HTML. Let's fix both.
    content = content.replace(/href="#"(.*?)>Uttarakhand/g, 'href="north-india.html"$1>Uttarakhand');
    content = content.replace(/href="#"(.*?)>Golden Triangle/g, 'href="north-india.html"$1>Golden Triangle');
    content = content.replace(/href="#"(.*?)>Goa/g, 'href="south-india.html"$1>Goa');
    content = content.replace(/href="#"(.*?)>Tamil Nadu/g, 'href="south-india.html"$1>Tamil Nadu');
    content = content.replace(/href="#"(.*?)>Karnataka/g, 'href="south-india.html"$1>Karnataka');
    content = content.replace(/href="#"(.*?)>Darjeeling/g, 'href="east-india.html"$1>Darjeeling');
    content = content.replace(/href="#"(.*?)>Gangtok/g, 'href="east-india.html"$1>Gangtok');
    content = content.replace(/href="#"(.*?)>Odisha/g, 'href="east-india.html"$1>Odisha');
    content = content.replace(/href="#"(.*?)>Gujarat/g, 'href="west-india.html"$1>Gujarat');
    content = content.replace(/href="#"(.*?)>Maharashtra/g, 'href="west-india.html"$1>Maharashtra');
    content = content.replace(/href="#"(.*?)>Contact/g, 'href="index.html#contact"$1>Contact');

    if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Updated frontend logic for ${file}`);
    }
});
