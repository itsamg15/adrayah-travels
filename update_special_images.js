const fs = require('fs');
let content = fs.readFileSync('special-tours.html', 'utf8');

const imageMap = {
    'Valley of Flowers Trek': 'assets/images/valley_of_flowers_1782716449446.png',
    'Hampta Pass Trek': 'assets/images/hampta_pass_1782716463726.png',
    'Kedarkantha Winter Trek': 'assets/images/kedarkantha_trek_1782716356288.png',
    'Chadar Trek': 'assets/images/chadar_trek_1782716370254.png',
    'Sandakphu Trek': 'assets/images/sandakphu_trek_1782716385374.png',
    'Scuba Diving': 'assets/images/andaman_scuba_1782716501097.png',
    'Snorkeling & Island Hopping': 'assets/images/andaman_scuba_1782716501097.png',
    'River Rafting': 'assets/images/rishikesh_rafting_1782716416262.png',
    'Skiing Adventure': 'assets/images/kashmir-escape.jpg',
    'Desert Camping': 'assets/rajasthan_desert.png',
    'Wildlife Safari': 'assets/images/kaziranga-rhino.jpg',
    'Tiger Safari': 'assets/images/kaziranga-rhino.jpg',
    'Houseboat Luxury Experience': 'assets/images/alleppey-backwaters.jpg',
    'Tea Estate Retreat': 'assets/images/darjeeling-tea-gardens.jpg',
    'Living Root Bridge Adventure': 'assets/images/living-root-bridge.jpg',
    'Hot Air Balloon Experience': 'assets/rajasthan_fort.png',
    'Rann of Kutch Festival Experience': 'assets/rann_of_kutch.png',
    'Spiti Valley Expedition': 'assets/images/lush-valleys.jpg',
    'Motorcycle Expedition': 'assets/images/himachal-explorer.jpg',
    'Sunrise at Tiger Hill': 'assets/images/darjeeling-tea-gardens.jpg',
    'Trekking Expeditions': 'assets/images/hampta_pass_1782716463726.png',
    'Water Adventures': 'assets/images/rishikesh_rafting_1782716416262.png',
    'Road Trips': 'assets/images/himachal-explorer.jpg',
    'Wildlife Safaris': 'assets/images/kaziranga-rhino.jpg',
    'Camping Experiences': 'assets/rajasthan_desert.png',
    'Luxury Escapes': 'assets/udaipur_lake.png',
    'Photography Tours': 'assets/images/special_tours_hero.png',
    'Spiritual Journeys': 'assets/images/konark-sun-temple.jpg',
    'Cultural Festivals': 'assets/rann_of_kutch.png'
};

const lines = content.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<img') && (lines[i].includes('assets/images/placeholder') || lines[i].includes('assets/images/goa_beach.png'))) {
        // Look ahead for title
        let title = '';
        for (let j = i; j < i + 15; j++) {
            if (lines[j] && lines[j].includes('<h3')) {
                title = lines[j].replace(/<[^>]*>?/gm, '').replace('&amp;', '&').trim();
                break;
            }
        }
        
        if (title && imageMap[title]) {
            lines[i] = lines[i].replace(/src="[^"]+"/, `src="${imageMap[title]}"`);
            modified = true;
        }
    }
}

if (modified) {
    fs.writeFileSync('special-tours.html', lines.join('\n'));
    console.log('Updated special-tours.html with new images.');
} else {
    console.log('No modifications made.');
}
