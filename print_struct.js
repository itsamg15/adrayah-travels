const fs = require('fs');
const content = fs.readFileSync('special-tours.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
    if(l.includes('<header') || l.includes('<section') || l.includes('<footer') || l.includes('id="conversion-strip"')) {
        console.log(i+1, l.trim().substring(0, 50));
    }
});
