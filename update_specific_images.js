const fs = require('fs');
let content = fs.readFileSync('special-tours.html', 'utf8');

const replacementMap = {
    'Houseboat Luxury Experience': 'assets/images/alleppey_houseboat_wk.jpg',
    'Tea Estate Retreat': 'assets/images/munnar_tea_wk.jpg',
    'Living Root Bridge Adventure': 'assets/images/root_bridge_wk.jpg',
    'Wildlife Safari': 'assets/images/ranthambore_safari_wk.jpg',
    'Tiger Safari': 'assets/images/tiger_wk.jpg',
    'Skiing Adventure': 'assets/images/gulmarg_ski_wk.jpg',
    'Motorcycle Expedition': 'assets/images/ladakh_motorcycle_wk.jpg',
    'Desert Camping': 'assets/images/jaisalmer_camp_wk.jpg'
};

const lines = content.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<img') && (lines[i].includes('src="assets/'))) {
        let title = '';
        for (let j = i; j < i + 15; j++) {
            if (lines[j] && lines[j].includes('<h3')) {
                title = lines[j].replace(/<[^>]*>?/gm, '').replace('&amp;', '&').trim();
                break;
            }
        }
        
        if (title && replacementMap[title]) {
            lines[i] = lines[i].replace(/src="[^"]+"/, `src="${replacementMap[title]}"`);
            modified = true;
        }
    }
}

if (modified) {
    fs.writeFileSync('special-tours.html', lines.join('\n'));
    console.log('Successfully updated 8 specific destination images.');
} else {
    console.log('No modifications made.');
}
