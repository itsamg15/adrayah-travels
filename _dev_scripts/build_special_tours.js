const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Get Header
const headerEnd = indexHtml.indexOf('<!-- Hero Section -->');
let header = indexHtml.substring(0, headerEnd);

// Fix navigation active state
header = header.replace(
    'data-nav="Special Tours" href="#"',
    'data-nav="Special Tours" href="special-tours.html" class="active-nav-placeholder"'
);

// Get Footer
const footerStart = indexHtml.indexOf('<!-- Footer -->');
const footer = indexHtml.substring(footerStart);

// Get Features section
const diffStart = indexHtml.indexOf('<!-- The Adrayah Difference -->');
const diffEnd = indexHtml.indexOf('</section>', diffStart) + 10;
const featuresSection = indexHtml.substring(diffStart, diffEnd).replace('The Adrayah Difference', 'Why Choose Our Special Tours').replace('The Adrayah Difference', 'Why Choose Our Special Tours');

// Get Testimonials section
const testStart = indexHtml.indexOf('<!-- Testimonials -->');
const testEnd = indexHtml.indexOf('</section>', testStart) + 10;
const testimonialsSection = indexHtml.substring(testStart, testEnd).replace('What Our Travelers Say', 'Traveler Stories').replace('What Our Travelers Say', 'Traveler Stories');

// Generate 20 Tour Cards
const tours = [
    { title: "Valley of Flowers Trek", state: "Uttarakhand", badge: "6 Days", diff: "Moderate", season: "Jul-Sep", desc: "A mesmerizing trek through a UNESCO World Heritage site blooming with alpine flowers.", img: "assets/images/placeholder1.jpg" },
    { title: "Hampta Pass Trek", state: "Himachal Pradesh", badge: "5 Days", diff: "Moderate", season: "Jun-Oct", desc: "A dramatic crossover trek from lush Kullu Valley to the barren landscapes of Lahaul.", img: "assets/images/placeholder2.jpg" },
    { title: "Kedarkantha Winter Trek", state: "Uttarakhand", badge: "6 Days", diff: "Easy to Moderate", season: "Dec-Apr", desc: "A classic winter trek offering snowy trails, stunning campsites, and a thrilling summit climb.", img: "assets/images/placeholder3.jpg" },
    { title: "Chadar Trek", state: "Ladakh", badge: "9 Days", diff: "Challenging", season: "Jan-Feb", desc: "An epic winter expedition walking over the frozen Zanskar River.", img: "assets/images/placeholder1.jpg" },
    { title: "Sandakphu Trek", state: "West Bengal", badge: "7 Days", diff: "Moderate", season: "Oct-May", desc: "Trek along the Singalila Ridge for panoramic views of Everest, Kangchenjunga, Lhotse, and Makalu.", img: "assets/images/placeholder2.jpg" },
    { title: "Scuba Diving", state: "Andaman & Nicobar Islands", badge: "4 Days", diff: "Easy", season: "Oct-May", desc: "Explore vibrant coral reefs and marine life in the pristine waters of Havelock Island.", img: "assets/images/placeholder3.jpg" },
    { title: "Snorkeling & Island Hopping", state: "Lakshadweep", badge: "5 Days", diff: "Easy", season: "Oct-May", desc: "Discover untouched coral atolls, turquoise lagoons, and secluded beaches.", img: "assets/images/placeholder1.jpg" },
    { title: "River Rafting", state: "Rishikesh", badge: "3 Days", diff: "Moderate", season: "Sep-Jun", desc: "Experience the thrill of navigating the white-water rapids of the holy Ganges.", img: "assets/images/placeholder2.jpg" },
    { title: "Skiing Adventure", state: "Gulmarg", badge: "6 Days", diff: "Moderate", season: "Dec-Mar", desc: "Glide down some of the best powdery slopes in the world, framed by the Himalayas.", img: "assets/images/placeholder3.jpg" },
    { title: "Desert Camping", state: "Jaisalmer", badge: "3 Days", diff: "Easy", season: "Oct-Mar", desc: "Sleep under the stars in the Thar Desert with camel safaris and cultural performances.", img: "assets/images/placeholder1.jpg" },
    { title: "Wildlife Safari", state: "Ranthambore National Park", badge: "4 Days", diff: "Easy", season: "Oct-Jun", desc: "Venture into the wild to spot majestic Bengal tigers amidst ancient ruins.", img: "assets/images/placeholder2.jpg" },
    { title: "Tiger Safari", state: "Jim Corbett National Park", badge: "4 Days", diff: "Easy", season: "Nov-Jun", desc: "Explore India's oldest national park known for its rich biodiversity and tiger population.", img: "assets/images/placeholder3.jpg" },
    { title: "Houseboat Luxury Experience", state: "Alleppey", badge: "3 Days", diff: "Easy", season: "Sep-Mar", desc: "Cruise peacefully through the emerald backwaters of Kerala in a traditional luxury houseboat.", img: "assets/images/placeholder1.jpg" },
    { title: "Tea Estate Retreat", state: "Munnar", badge: "4 Days", diff: "Easy", season: "Sep-May", desc: "Immerse yourself in the tranquility of rolling hills covered in lush green tea plantations.", img: "assets/images/placeholder2.jpg" },
    { title: "Living Root Bridge Adventure", state: "Meghalaya", badge: "5 Days", diff: "Moderate", season: "Oct-May", desc: "Hike through dense jungles to witness the incredible bio-engineering of living root bridges.", img: "assets/images/placeholder3.jpg" },
    { title: "Hot Air Balloon Experience", state: "Jaipur", badge: "2 Days", diff: "Easy", season: "Sep-Apr", desc: "Float above the Pink City and marvel at historic forts and palaces from the sky.", img: "assets/images/placeholder1.jpg" },
    { title: "Rann of Kutch Festival Experience", state: "Gujarat", badge: "4 Days", diff: "Easy", season: "Nov-Feb", desc: "Witness the spectacular white salt desert under a full moon during the vibrant Rann Utsav.", img: "assets/images/placeholder2.jpg" },
    { title: "Spiti Valley Expedition", state: "Himachal Pradesh", badge: "8 Days", diff: "Moderate", season: "Jun-Oct", desc: "A road trip through a high-altitude cold desert, ancient monasteries, and rugged landscapes.", img: "assets/images/placeholder3.jpg" },
    { title: "Motorcycle Expedition", state: "Leh–Ladakh", badge: "12 Days", diff: "Challenging", season: "Jun-Sep", desc: "The ultimate riding adventure crossing some of the highest motorable passes in the world.", img: "assets/images/placeholder1.jpg" },
    { title: "Sunrise at Tiger Hill", state: "Darjeeling", badge: "3 Days", diff: "Easy", season: "Mar-May, Oct-Dec", desc: "Watch the spectacular sunrise illuminating the peaks of Mount Kangchenjunga.", img: "assets/images/placeholder2.jpg" }
];

let toursHtml = '';
for (const t of tours) {
    toursHtml += `
<div class="glass-panel rounded-3xl overflow-hidden flex flex-col bg-surface-muted/50 hover:shadow-xl transition-all duration-300 cursor-pointer" onclick="openEnquiryModal('${t.title}')">
<div class="h-64 overflow-hidden relative">
<img alt="${t.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="${t.img}">
<div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold border border-white/20">${t.season}</div>
</div>
<div class="p-6 flex flex-col flex-grow">
<div class="flex justify-between items-start mb-2">
<div>
<h3 class="font-title-lg text-title-lg text-primary">${t.title}</h3>
<p class="text-sm text-on-tertiary-container font-bold uppercase tracking-wider">${t.state}</p>
</div>
<span class="bg-primary-container text-on-primary-container text-xs px-3 py-1 rounded-full font-bold">${t.badge}</span>
</div>
<p class="font-body-md text-on-surface-variant mb-4 flex-grow">${t.desc}</p>
<div class="flex items-center gap-2 mb-6">
<span class="material-symbols-outlined text-secondary text-sm">hiking</span>
<span class="text-sm text-secondary font-bold">${t.diff}</span>
</div>
<div class="flex flex-col gap-3">
<button class="w-full border border-primary text-primary py-3 rounded-full font-label-md hover:bg-primary/5 transition-colors" onclick="event.stopPropagation(); openEnquiryModal('${t.title}')">View Details</button>
<button class="w-full bg-on-tertiary-container text-white py-3 rounded-full font-label-md hover:opacity-90 transition-opacity shadow-md" onclick="event.stopPropagation(); openEnquiryModal('${t.title}')">Get Personalized Quote</button>
</div>
</div>
</div>
`;
}

// Generate Categories
const categories = [
    { title: "Trekking Expeditions", icon: "hiking" },
    { title: "Water Adventures", icon: "water_drop" },
    { title: "Road Trips", icon: "directions_car" },
    { title: "Wildlife Safaris", icon: "pets" },
    { title: "Camping Experiences", icon: "camping" },
    { title: "Luxury Escapes", icon: "hotel_class" },
    { title: "Photography Tours", icon: "photo_camera" },
    { title: "Spiritual Journeys", icon: "self_improvement" },
    { title: "Cultural Festivals", icon: "festival" }
];

let catHtml = '';
for (const c of categories) {
    catHtml += `
<div class="relative rounded-3xl overflow-hidden group h-64 block cursor-pointer" onclick="openEnquiryModal('${c.title}')">
<img alt="${c.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="assets/images/placeholder1.jpg">
<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
<div class="absolute inset-0 p-6 flex flex-col justify-end">
<span class="bg-white/20 backdrop-blur-md text-white font-label-md text-label-md px-3 py-1 rounded-full w-fit mb-3 flex items-center gap-1"><span class="material-symbols-outlined text-sm">${c.icon}</span> Explore</span>
<h3 class="font-headline-md text-headline-md text-white mb-2 font-serif">${c.title}</h3>
</div>
</div>
`;
}

const mainContent = `
<!-- Hero Section -->
<section class="relative h-screen min-h-[600px] flex items-end pb-24 pt-32 justify-center overflow-hidden bg-primary">
<div class="absolute inset-0 z-0" style="pointer-events: none;">
<img alt="Special Tours" class="w-full h-full object-cover opacity-60" src="assets/images/placeholder2.jpg">
</div>
<div class="absolute inset-0 hero-gradient bg-black/20 z-10" style="pointer-events: none;"></div>
<div class="relative z-20 w-full px-margin-mobile md:px-margin-desktop pb-20 text-center flex flex-col items-center" style="pointer-events: auto;">
<span class="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-label-md text-label-md mb-4 border border-white/30 uppercase tracking-widest">Special Tours</span>
<h1 class="font-display-lg text-display-lg text-white mb-4 shadow-sm">Extraordinary Experiences<br>Across India</h1>
<p class="font-headline-md text-headline-md text-white/90 mb-10 max-w-3xl mx-auto italic">Discover India's hidden adventures, thrilling expeditions, wildlife escapes, and unforgettable experiences crafted for travelers seeking something beyond the ordinary.</p>
<div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
<a class="w-full sm:w-auto inline-flex items-center justify-center bg-on-tertiary-container text-white px-8 py-4 rounded-full font-label-md text-label-md hover:shadow-lg hover:shadow-on-tertiary-container/30 transition-all transform hover:-translate-y-1 uppercase tracking-wider" href="#enquiry">
<span class="material-symbols-outlined mr-2 text-xl">mail</span>
                    Get Personalized Quote
                </a>
<a class="w-full sm:w-auto inline-flex items-center justify-center border border-white text-white px-6 py-4 rounded-full font-label-md text-label-md hover:bg-white/10 transition-all flex items-center gap-2 glass-panel uppercase tracking-wider" href="https://wa.me/919654182903" target="_blank">
<span class="material-symbols-outlined mr-2 text-xl">chat</span>
                    Chat on WhatsApp
                </a>
</div>
</div>
</section>

<main class="relative z-30 bg-background -mt-4 rounded-t-xl pt-section-gap pb-32 space-y-section-gap">
    <!-- Featured Special Tours -->
    <section class="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto" id="featured-tours">
        <div class="text-center mb-16">
            <h2 class="font-headline-lg text-headline-lg text-primary mb-4 hidden md:block font-serif">Featured Special Tours</h2>
            <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-4 md:hidden font-serif">Featured Special Tours</h2>
            <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Handpicked journeys for the discerning traveler.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${toursHtml}
        </div>
    </section>

    <!-- Experiences by Category -->
    <section class="bg-surface-container-low py-20 px-margin-mobile md:px-margin-desktop" id="categories">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="font-headline-lg text-headline-lg text-primary mb-4 hidden md:block font-serif">Experiences by Category</h2>
                <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-4 md:hidden font-serif">Experiences by Category</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${catHtml}
            </div>
        </div>
    </section>

    ${featuresSection}

    ${testimonialsSection}

    <!-- Final CTA -->
    <section class="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto text-center py-16 bg-primary rounded-3xl relative overflow-hidden" id="final-cta">
        <div class="absolute inset-0 opacity-10 bg-[url('assets/images/placeholder1.jpg')] bg-cover bg-center"></div>
        <div class="relative z-10 p-8">
            <h2 class="font-display-md text-display-md text-white mb-8 font-serif">Ready for Your Next Extraordinary Adventure?</h2>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a class="w-full sm:w-auto inline-flex items-center justify-center bg-on-tertiary-container text-white px-8 py-4 rounded-full font-label-md text-label-md hover:shadow-lg hover:shadow-on-tertiary-container/30 transition-all transform hover:-translate-y-1 uppercase tracking-wider" href="#enquiry">
                    <span class="material-symbols-outlined mr-2 text-xl">mail</span>
                    Get Personalized Quote
                </a>
                <a class="w-full sm:w-auto inline-flex items-center justify-center border border-white text-white px-6 py-4 rounded-full font-label-md text-label-md hover:bg-white/10 transition-all flex items-center gap-2 glass-panel uppercase tracking-wider" href="https://wa.me/919654182903" target="_blank">
                    <span class="material-symbols-outlined mr-2 text-xl">chat</span>
                    Chat on WhatsApp
                </a>
            </div>
        </div>
    </section>

</main>
`;

fs.writeFileSync('special-tours.html', header + mainContent + footer);
console.log('special-tours.html fully constructed.');
