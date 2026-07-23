const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = './';
const targetFiles = ['east-india.html', 'index.html', 'meghalaya-discovery.html', 'special-tours.html'];

targetFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find h4 tags that follow an h2 directly or are just out of place
    // Actually, it's easier to just change all h4 tags to h3 if there are no h3 tags preceding them.
    // Let's just do a manual replace of <h4 ...> to <h3 ...> and </h4> to </h3>
    // since JSDOM modifying tagNames is tricky (have to replace node).
    
    const h4s = document.querySelectorAll('h4');
    h4s.forEach(h4 => {
        const h3 = document.createElement('h3');
        h3.innerHTML = h4.innerHTML;
        // copy attributes
        Array.from(h4.attributes).forEach(attr => h3.setAttribute(attr.name, attr.value));
        h4.parentNode.replaceChild(h3, h4);
    });

    fs.writeFileSync(filePath, dom.serialize(), 'utf8');
    console.log(`Fixed headings in ${file}`);
});
