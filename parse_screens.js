const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:\\Users\\Deepak Gupta\\.gemini\\antigravity-ide\\brain\\6f27b7b2-d6ce-4870-b7b5-d3b882a04672\\.system_generated\\steps\\336\\output.txt', 'utf8'));
console.log('Total screens:', data.screens.length);

const imageScreens = data.screens.filter(s => s.screenshot && s.screenshot.downloadUrl);
console.log('Screens with screenshots:', imageScreens.length);

imageScreens.forEach(s => {
    console.log(`- ${s.title.substring(0, 80)}`);
});
