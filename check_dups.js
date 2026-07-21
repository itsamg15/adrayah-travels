const fs = require('fs');
const content = fs.readFileSync('special-tours.html', 'utf8');

const tags = ['<html', '<head', '<body', '<header', 'id="conversion-strip"', '<!-- Footer -->', '<!-- Mobile Menu Overlay -->'];

tags.forEach(tag => {
    const regex = new RegExp(tag, 'g');
    const matches = content.match(regex);
    console.log(tag, matches ? matches.length : 0);
});
