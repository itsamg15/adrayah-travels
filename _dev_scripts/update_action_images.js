const fs = require('fs');
let content = fs.readFileSync('special-tours.html', 'utf8');

const replacementMap = {
    'Snorkeling & Island Hopping': 'assets/images/lakshadweep_snorkeling_action_1782793896704.png',
    'Skiing Adventure': 'assets/images/gulmarg_skiing_action_1782793909646.png',
    'Tiger Safari': 'assets/images/corbett_tiger_action_1782793953490.png',
    'Hot Air Balloon Experience': 'assets/images/jaipur_balloon_action_1782793965405.png',
    'Motorcycle Expedition': 'assets/images/leh_motorcycle_group_1782793927631.png',
    'Sunrise at Tiger Hill': 'assets/images/darjeeling_sunrise_action_1782794159978.png'
};

const lines = content.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
    // Only replace if it contains an image tag
    if (lines[i].includes('<img') && lines[i].includes('src=')) {
        let title = '';
        // Look ahead to find the title associated with this image
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
    console.log('Successfully updated 6 images with the new action shots!');
} else {
    console.log('No modifications made.');
}
