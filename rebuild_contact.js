const fs = require('fs');
const { JSDOM } = require('jsdom');

const contactHtmlPath = 'contact.html';
const html = fs.readFileSync(contactHtmlPath, 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

// 1. Update Meta and Title
document.title = 'Contact Adrayah Travels | Plan Your Next Journey';
let metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) {
    metaDesc.content = 'Contact Adrayah Travels through our enquiry form for customized holiday packages, travel assistance, destination planning, and personalized itineraries.';
}

let ogTitle = document.querySelector('meta[property="og:title"]');
if (ogTitle) ogTitle.content = document.title;
let ogDesc = document.querySelector('meta[property="og:description"]');
if (ogDesc) ogDesc.content = metaDesc.content;

// 2. Replace the main body section
const oldSection = document.querySelector('section');
if (oldSection) oldSection.remove();

const newContent = `
<!-- Hero Section -->
<section class="relative pt-40 pb-24 px-4 md:px-8 bg-surface overflow-hidden">
    <!-- Premium background elements -->
    <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
    </div>
    
    <div class="max-w-7xl mx-auto relative z-10 text-center">
        <h1 class="text-5xl md:text-6xl font-display-lg text-primary mb-6 animate-fade-in-up">Contact Adrayah Travels</h1>
        <p class="text-xl text-on-surface-variant max-w-3xl mx-auto animate-fade-in-up" style="animation-delay: 100ms;">
            We'd love to help you plan your journey or answer your travel-related questions.
        </p>
    </div>
</section>

<!-- Content & Form Section -->
<section class="py-16 px-4 md:px-8 bg-surface-muted">
    <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            <!-- Left Column: Information & CTA -->
            <div class="space-y-10">
                <!-- Info Card -->
                <div class="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-outline-variant/50">
                    <h2 class="text-3xl font-headline-md text-primary mb-6">Get in Touch</h2>
                    <ul class="space-y-4 mb-8 text-on-surface-variant font-body-md text-lg">
                        <li class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-secondary">check_circle</span>
                            Planning a holiday?
                        </li>
                        <li class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-secondary">check_circle</span>
                            Need a customized itinerary?
                        </li>
                        <li class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-secondary">check_circle</span>
                            Have questions about one of our travel packages?
                        </li>
                        <li class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-secondary">check_circle</span>
                            Need assistance before booking?
                        </li>
                    </ul>
                    <p class="text-on-surface-variant font-body-md text-lg leading-relaxed font-medium">
                        We're here to help.<br><br>
                        Simply fill out the enquiry form and briefly tell us about your travel plans, questions, or any assistance you need. Our team will carefully review your enquiry and get back to you as soon as possible.
                    </p>
                </div>
                
                <!-- CTA Card -->
                <div class="bg-primary/5 rounded-3xl p-8 md:p-10 border border-primary/10">
                    <h3 class="text-2xl font-headline-md text-primary mb-6">Why Contact Us?</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div class="flex items-center gap-2 text-on-surface font-body-md">
                            <span class="material-symbols-outlined text-secondary text-sm">trip_origin</span>
                            Personalized travel planning
                        </div>
                        <div class="flex items-center gap-2 text-on-surface font-body-md">
                            <span class="material-symbols-outlined text-secondary text-sm">trip_origin</span>
                            Custom holiday packages
                        </div>
                        <div class="flex items-center gap-2 text-on-surface font-body-md">
                            <span class="material-symbols-outlined text-secondary text-sm">trip_origin</span>
                            Destination recommendations
                        </div>
                        <div class="flex items-center gap-2 text-on-surface font-body-md">
                            <span class="material-symbols-outlined text-secondary text-sm">trip_origin</span>
                            Family trips
                        </div>
                        <div class="flex items-center gap-2 text-on-surface font-body-md">
                            <span class="material-symbols-outlined text-secondary text-sm">trip_origin</span>
                            Honeymoon planning
                        </div>
                        <div class="flex items-center gap-2 text-on-surface font-body-md">
                            <span class="material-symbols-outlined text-secondary text-sm">trip_origin</span>
                            Group tours
                        </div>
                        <div class="flex items-center gap-2 text-on-surface font-body-md">
                            <span class="material-symbols-outlined text-secondary text-sm">trip_origin</span>
                            Corporate travel assistance
                        </div>
                    </div>
                    <p class="text-primary font-body-md italic border-l-4 border-secondary pl-4 py-1">
                        Every enquiry is personally reviewed by our travel team to ensure you receive the most suitable travel recommendations.
                    </p>
                </div>
            </div>
            
            <!-- Right Column: Form -->
            <div class="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-outline-variant/30 sticky top-32">
                <h3 class="text-2xl font-headline-md text-primary mb-8 text-center border-b border-outline-variant pb-6">Submit Your Enquiry</h3>
                
                <!-- The JS will inject the actual form here -->
                <div id="enquiry-form-container"></div>
                
                <!-- Privacy Section -->
                <div class="mt-8 pt-6 border-t border-outline-variant/50 text-center">
                    <div class="flex items-center justify-center gap-2 text-on-surface-variant mb-2">
                        <span class="material-symbols-outlined text-sm">lock</span>
                        <span class="font-label-md text-sm uppercase tracking-wider">Privacy Guaranteed</span>
                    </div>
                    <p class="text-xs text-on-surface-variant/80 font-body-md leading-relaxed">
                        Your information is used only to respond to your enquiry. We respect your privacy and never sell or share your personal information with third parties.
                    </p>
                </div>
            </div>
            
        </div>
    </div>
</section>
`;

const header = document.querySelector('header');
const temp = document.createElement('div');
temp.innerHTML = newContent;
Array.from(temp.children).reverse().forEach(child => {
    header.insertAdjacentElement('afterend', child);
});

// 3. Update the footer to ensure no contact info exists
// We already replaced it in the last script, but let's double check there is no phone number at all
const footerText = document.querySelector('footer').innerHTML;
// Re-clean any "+91" or "Email" just in case it's in another column
document.querySelectorAll('footer p, footer a, footer h3, footer li').forEach(el => {
    const text = el.textContent.toLowerCase();
    if (text.includes('whatsapp') || text.includes('phone') || text.includes('call us') || text.includes('email') || text.includes('@')) {
        el.remove();
    }
});

// We need to make sure the "Contact Us" footer link points to contact.html
// We did this globally in the last script, but let's re-verify
document.querySelectorAll('a').forEach(a => {
    if (a.textContent.toLowerCase().includes('contact')) {
        a.href = 'contact.html';
    }
});

fs.writeFileSync(contactHtmlPath, dom.serialize(), 'utf8');
console.log('Successfully rebuilt contact.html');
