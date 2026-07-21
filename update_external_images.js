const fs = require('fs');
let content = fs.readFileSync('special-tours.html', 'utf8');

const replacementMap = {
    'Snorkeling & Island Hopping': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Andaman_Islands.PNG',
    'Skiing Adventure': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Gulmarg.JPG/960px-Gulmarg.JPG',
    'Tiger Safari': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Bengal_tiger_%28Panthera_tigris_tigris%29_female_3_crop.jpg/960px-Bengal_tiger_%28Panthera_tigris_tigris%29_female_3_crop.jpg',
    'Hot Air Balloon Experience': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/2006_Ojiya_balloon_festival_011.jpg/960px-2006_Ojiya_balloon_festival_011.jpg',
    'Motorcycle Expedition': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Spiti_River_Kaza_Himachal_Jun18_D72_7232.jpg/960px-Spiti_River_Kaza_Himachal_Jun18_D72_7232.jpg',
    'Sunrise at Tiger Hill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Tiger_Hill_Darjeeling_West_Bengal_India_%283%29.JPG/960px-Tiger_Hill_Darjeeling_West_Bengal_India_%283%29.JPG'
};

const lines = content.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<img') && lines[i].includes('src=')) {
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
    console.log('Successfully updated 6 external Wikimedia image URLs.');
} else {
    console.log('No modifications made.');
}
