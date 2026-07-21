const fs = require('fs');

const content = fs.readFileSync('special-tours.html', 'utf8');
const lines = content.split('\n');

// 0-indexed: lines 1 to 851 -> indices 0 to 850
const chunk1 = lines.slice(0, 851); 

// 0-indexed: lines 1428 to end -> indices 1427 to end
const chunk3 = lines.slice(1427);

const finalLines = [...chunk1, '', ...chunk3];

fs.writeFileSync('special-tours.html', finalLines.join('\n'));
console.log('Fixed special-tours.html by removing duplicate sections.');
