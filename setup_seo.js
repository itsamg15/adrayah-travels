const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('backup'));
const baseUrl = 'https://adrayah-travels.vercel.app'; // assuming this domain, or something generic

const titles = {
    'index.html': 'Adrayah Travels - Exotic India through a lens of luxury',
    'north-india.html': 'North India Tours - Adrayah Travels',
    'south-india.html': 'South India Tours - Adrayah Travels',
    'east-india.html': 'East India Tours - Adrayah Travels',
    'west-india.html': 'West India Tours - Adrayah Travels',
    'special-tours.html': 'Special Tours - Adrayah Travels',
    'kashmir-escape.html': 'Kashmir Escape - Adrayah Travels',
    'rajasthan-royal-circuit.html': 'Rajasthan Royal Circuit - Adrayah Travels',
    'meghalaya-discovery.html': 'Meghalaya Discovery - Adrayah Travels',
    'kerala-retreat.html': 'Kerala Retreat - Adrayah Travels',
    'himachal-explorer.html': 'Himachal Explorer - Adrayah Travels',
    'contact.html': 'Contact Us - Adrayah Travels',
    '404.html': 'Page Not Found - Adrayah Travels'
};

const descriptions = {
    'index.html': 'Discover exotic India with Adrayah Travels. Experience luxury tours across North, South, East, and West India.',
    'contact.html': 'Contact Adrayah Travels to book your next luxury tour across India.'
};

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

files.forEach(file => {
    if (file === '404.html') return;
    sitemap += `  <url>\n    <loc>${baseUrl}/${file === 'index.html' ? '' : file}</loc>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
});
sitemap += '</urlset>';
fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemap, 'utf8');

const robots = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(dir, 'robots.txt'), robots, 'utf8');

files.forEach(file => {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Update links pointing to #contact or other things to contact.html
    const links = document.querySelectorAll('a');
    links.forEach(a => {
        const text = a.textContent.toLowerCase();
        if (text.includes('contact') && !text.includes('contact.html')) {
            a.href = 'contact.html';
        }
    });

    const title = titles[file] || `Adrayah Travels - ${file.replace('.html', '').replace('-', ' ')}`;
    const desc = descriptions[file] || `Explore our tailored ${file.replace('.html', '').replace('-', ' ')} tours with Adrayah Travels, your trusted partner for luxury travel in India.`;
    const url = `${baseUrl}/${file === 'index.html' ? '' : file}`;
    
    // Remove existing meta tags we are going to replace
    const head = document.head;
    head.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], script[type="application/ld+json"]').forEach(e => e.remove());
    
    document.title = title;
    
    const metaTags = `
        <meta name="description" content="${desc}">
        <link rel="canonical" href="${url}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${desc}">
        <meta property="og:url" content="${url}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${desc}">
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Adrayah Travels",
            "url": "${baseUrl}",
            "description": "Exotic India through a lens of luxury.",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
            }
        }
        </script>
    `;
    
    const temp = document.createElement('div');
    temp.innerHTML = metaTags;
    Array.from(temp.children).forEach(child => head.appendChild(child));
    
    // Special fix for the buttons missing aria-label (found in Lighthouse)
    // "Buttons without aria-label or text"
    const buttons = document.querySelectorAll('button');
    buttons.forEach(b => {
        if (!b.textContent.trim() && !b.getAttribute('aria-label')) {
            // usually these are close buttons for modals, slider arrows, or hamburger
            b.setAttribute('aria-label', b.id || b.className.includes('menu') ? 'Toggle Menu' : 'Action');
        }
    });

    fs.writeFileSync(filePath, dom.serialize(), 'utf8');
    console.log(`Updated SEO for ${file}`);
});
