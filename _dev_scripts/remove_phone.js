const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let originalContent = content;

    // 1. Remove Footer Phone Numbers
    const phoneRegex1 = /<div class="flex items-center gap-3 text-white\/80 hover:text-white transition-colors cursor-pointer">\s*<span class="material-symbols-outlined text-\[20px\]">(chat|call)<\/span>\s*<span class="font-body-md text-\[15px\]">\+91 9654182903<\/span>\s*<\/div>/g;
    const phoneRegex2 = /<div class="flex items-center gap-3 text-white\/80 hover:text-white transition-colors cursor-pointer">\s*<span class="material-symbols-outlined text-\[20px\]">(chat|call)<\/span>\s*<span class="font-body-md text-\[15px\]">\+91 7982037419<\/span>\s*<\/div>/g;
    content = content.replace(phoneRegex1, '');
    content = content.replace(phoneRegex2, '');
    
    // Fallback if there's any stray phone numbers formatted differently
    content = content.replace(/<p[^>]*>\+91 9654182903<\/p>/g, '');
    content = content.replace(/<span[^>]*>\+91 9654182903<\/span>/g, '');
    content = content.replace(/<a[^>]*href="tel:\+919654182903"[^>]*>.*?<\/a>/gs, '');

    // 2. Add Business Hours & Response Time to the Contact Column in the footer
    if (content.includes('info@adrayahtravels.com')) {
        // Find the email block and append our new info right after it within the flex-col
        const emailBlockRegex = /(<div class="flex items-center gap-3 text-white\/80 hover:text-white transition-colors cursor-pointer">\s*<span class="material-symbols-outlined text-\[20px\]">mail<\/span>\s*<span class="font-body-md text-\[15px\]">info@adrayahtravels\.com<\/span>\s*<\/div>)/;
        
        const newContactInfo = `
            <div class="flex items-start gap-3 text-white/80 mt-2">
                <span class="material-symbols-outlined text-[20px]">schedule</span>
                <div class="flex flex-col">
                    <span class="font-body-md text-[15px] font-bold">Business Hours</span>
                    <span class="font-body-md text-[14px]">Mon - Sat: 10 AM to 7 PM</span>
                    <span class="font-body-md text-[13px] text-primary/80 mt-1 italic">We'll contact you within 30 minutes during business hours.</span>
                </div>
            </div>
            <button onclick="openEnquiryModal('General')" class="mt-4 w-full bg-primary text-on-primary font-label-md py-3 rounded-full hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[20px]">edit_document</span>
                Enquire Now
            </button>
        `;
        // Only replace once per file
        if (!content.includes('Business Hours')) {
            content = content.replace(emailBlockRegex, `$1\n${newContactInfo}`);
        }
    }

    // 3. Remove Sticky Mobile Contact Bar
    // The bar looks like: <div class="md:hidden fixed bottom-6 right-6 z-50 flex gap-4"> ... </div>
    // Let's use a non-greedy regex to match from <!-- BottomNavBar (Mobile Only) --> to the closing </div>
    const stickyBarRegex = /<!-- BottomNavBar \(Mobile Only\) -->\s*<div class="md:hidden fixed bottom-6 right-6 z-50 flex gap-4">[\s\S]*?<\/div>/g;
    content = content.replace(stickyBarRegex, '');

    // What if the comment isn't there?
    const stickyBarRegex2 = /<!-- Sticky Mobile Contact Bar -->\s*<div class="md:hidden fixed bottom-6 right-6 z-50 flex gap-4">[\s\S]*?<\/div>/g;
    content = content.replace(stickyBarRegex2, '');

    // 4. Update all wa.me links to trigger Enquiry Modal
    content = content.replace(/href="https:\/\/wa\.me\/919654182903[^"]*"/g, 'href="#" onclick="event.preventDefault(); openEnquiryModal(\'General\');"');
    
    // Replace the text "Chat on WhatsApp" with "Enquire via Form"
    content = content.replace(/Chat on WhatsApp/g, 'Enquire via Form');
    // Change WhatsApp specific icons if possible (though "chat" is generic enough, let's just leave it or change to "edit_document")
    // Let's just leave the "chat" icon, it's fine.

    if (content !== originalContent) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Updated contact info in ${file}`);
    }
});
