const fs = require('fs');
const p1 = JSON.parse(fs.readFileSync('C:/Users/Deepak Gupta/.gemini/antigravity-ide/brain/6f27b7b2-d6ce-4870-b7b5-d3b882a04672/.system_generated/steps/336/output.txt', 'utf8'));
const p2 = JSON.parse(fs.readFileSync('C:/Users/Deepak Gupta/.gemini/antigravity-ide/brain/6f27b7b2-d6ce-4870-b7b5-d3b882a04672/.system_generated/steps/424/output.txt', 'utf8'));
const p3 = JSON.parse(fs.readFileSync('C:/Users/Deepak Gupta/.gemini/antigravity-ide/brain/6f27b7b2-d6ce-4870-b7b5-d3b882a04672/.system_generated/steps/391/output.txt', 'utf8'));

let allScreens = [];
[p1, p2, p3].forEach((p, idx) => {
    let s = p.screens.filter(x => x.screenshot && x.screenshot.downloadUrl);
    s.forEach(x => {
        allScreens.push({
            projectIndex: idx + 1,
            title: x.title,
            url: x.screenshot.downloadUrl
        });
    });
});

fs.writeFileSync('all_screens.json', JSON.stringify(allScreens, null, 2));
console.log('Total screenshot screens:', allScreens.length);
