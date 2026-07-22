const fs = require('fs');
let content = fs.readFileSync('special-tours.html', 'utf8');
content = content.replace(/'rajasthan-royal-circuit': 'West India'/g, "'rajasthan-royal-circuit': 'West India',\n        'special-tours': 'Special Tours'");
fs.writeFileSync('special-tours.html', content);
