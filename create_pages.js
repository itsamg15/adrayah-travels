const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = './';
const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

function setupPage(html, title, content) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    document.title = title;
    
    // Remove all sections (everything between header and footer)
    const sections = document.querySelectorAll('section');
    sections.forEach(s => s.remove());
    
    // Also remove the modal div just in case it interferes, though it shouldn't
    const modal = document.getElementById('enquiry-modal');
    if (modal) modal.remove();
    
    // Insert new content right after header
    const header = document.querySelector('header');
    if (header) {
        const temp = document.createElement('div');
        temp.innerHTML = content;
        header.insertAdjacentElement('afterend', temp.firstElementChild);
    }

    // Remove contact info from footer
    const footerEmail = document.querySelector('a[href^="mailto:"]');
    if (footerEmail && footerEmail.closest('p')) footerEmail.closest('p').remove();
    
    const footerContactHeaders = Array.from(document.querySelectorAll('h3')).filter(h => h.textContent.includes('Contact Us'));
    footerContactHeaders.forEach(h3 => {
        const col = h3.closest('div');
        if (col) {
            col.innerHTML = `
                <h3 class="font-headline-md text-xl mb-4 text-white">Contact Us</h3>
                <p class="font-body-md text-white/80 mb-2">Please use the enquiry form on this page to get in touch with us.</p>
                <p class="font-body-md text-white/80">Business Hours: Mon-Sat, 10 AM to 7 PM</p>
            `;
        }
    });
    
    // Also change the form's id so it can still hook into enquiry-system.js if needed, or we just write a simple handler.
    // The enquiry-system.js binds to '#enquiry-form', we'll use that.
    
    return dom.serialize();
}

const contactContent = `
<section class="pt-32 pb-16 px-4 md:px-8 bg-surface">
    <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-display-lg text-primary mb-6">Contact Us</h1>
        <p class="text-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
            Please submit your enquiry using the form below. Our team will review your request and get back to you shortly.
        </p>
        
        <div class="glass-panel rounded-2xl p-8 max-w-2xl mx-auto text-left shadow-lg bg-surface">
            <h2 class="text-2xl font-headline-md text-primary mb-6">Send an Enquiry</h2>
            <form id="enquiry-form" class="flex flex-col gap-4">
                <input type="hidden" id="package-name" value="General Contact Enquiry">
                <div>
                    <label class="block text-sm font-label-md text-on-surface mb-1">Name</label>
                    <input type="text" id="customer-name" required class="w-full rounded-lg border-outline-variant bg-surface-container focus:ring-secondary focus:border-secondary p-3">
                </div>
                <div>
                    <label class="block text-sm font-label-md text-on-surface mb-1">Email</label>
                    <input type="email" id="customer-email" required class="w-full rounded-lg border-outline-variant bg-surface-container focus:ring-secondary focus:border-secondary p-3">
                </div>
                <div>
                    <label class="block text-sm font-label-md text-on-surface mb-1">Message</label>
                    <textarea id="customer-message" required rows="4" class="w-full rounded-lg border-outline-variant bg-surface-container focus:ring-secondary focus:border-secondary p-3"></textarea>
                </div>
                <button type="submit" class="bg-primary text-white py-3 px-6 rounded-full font-label-md hover:bg-primary-container transition-colors mt-4">
                    Submit Enquiry
                </button>
            </form>
            <div id="form-success-msg" class="hidden mt-4 p-4 bg-success-green/20 text-success-green rounded-lg font-body-md text-center">
                Thank you! Your enquiry has been received. Our team will contact you shortly.
            </div>
        </div>
    </div>
</section>
`;

fs.writeFileSync(path.join(dir, 'contact.html'), setupPage(indexHtml, 'Contact Us - Adrayah Travels', contactContent), 'utf8');
console.log('Created contact.html');

const notFoundContent = `
<section class="min-h-[70vh] flex items-center justify-center pt-32 pb-16 px-4 md:px-8 bg-surface text-center">
    <div class="max-w-xl mx-auto">
        <h1 class="text-8xl font-display-lg text-primary mb-4">404</h1>
        <h2 class="text-3xl font-headline-md text-on-surface mb-6">Page Not Found</h2>
        <p class="text-lg text-on-surface-variant mb-8">
            The page you are looking for doesn't exist or has been moved.
        </p>
        <a href="index.html" class="inline-block bg-primary text-white py-3 px-8 rounded-full font-label-md hover:bg-primary-container transition-colors">
            Return to Homepage
        </a>
    </div>
</section>
`;

fs.writeFileSync(path.join(dir, '404.html'), setupPage(indexHtml, 'Page Not Found - Adrayah Travels', notFoundContent), 'utf8');
console.log('Created 404.html');

