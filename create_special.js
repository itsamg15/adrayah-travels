const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const headerEnd = indexHtml.indexOf('<!-- Hero Section -->');
const footerStart = indexHtml.indexOf('<!-- Footer -->');

let header = indexHtml.substring(0, headerEnd);
const footer = indexHtml.substring(footerStart);

// Update active state in header
header = header.replace(
    'data-nav="Special Tours" href="#"',
    'data-nav="Special Tours" href="special-tours.html" class="active-nav-placeholder"'
);

const skeleton = header + 
`<!-- Hero Section -->
<section class="relative h-screen min-h-[600px] flex items-end pb-24 pt-32 justify-center overflow-hidden bg-primary">
    <!-- HERO GOES HERE -->
</section>

<main class="relative z-30 bg-background -mt-4 rounded-t-xl pt-section-gap pb-32">
    <!-- CONTENT GOES HERE -->
</main>
` + footer;

fs.writeFileSync('special-tours.html', skeleton);
console.log('special-tours.html skeleton created.');
