const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    // Fix "Enquire via Form" CTA that misses onclick
    content = content.replace(/<a([^>]*)(href="#")([^>]*)>\s*<span class="material-symbols-outlined mr-2 text-xl">chat<\/span>\s*Enquire via Form\s*<\/a>/g, 
        '<a$1href="#" onclick="event.preventDefault(); openEnquiryModal(\'General\');"$3>\n<span class="material-symbols-outlined mr-2 text-xl">chat</span>\n                    Enquire via Form\n                </a>');

    // Fix "Request Callback" CTA in west-india
    content = content.replace(/<a([^>]*)(href="#")([^>]*)>\s*<span class="material-symbols-outlined text-sm">call_made<\/span> Request Callback <\/a>/g, 
        '<a$1href="#" onclick="event.preventDefault(); openCallbackModal();"$3> <span class="material-symbols-outlined text-sm">call_made</span> Request Callback </a>');

    // Fix "Explore Region Guide" in east-india
    content = content.replace(/<a([^>]*)(href="#")([^>]*)>\s*Explore Region Guide\s*<span/g, 
        '<a$1href="javascript:void(0)"$3>\n                    Explore Region Guide\n                    <span');

    // Fix all social icon dummy links to javascript:void(0)
    content = content.replace(/<a href="#" class="w-10 h-10/g, '<a href="javascript:void(0)" class="w-10 h-10');

    if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Fixed hrefs in ${file}`);
    }
});
