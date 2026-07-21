const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Replace <form> ... </form> with <div id="enquiry-form-container"></div>
    // Only if it contains the typical enquiry buttons
    const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/g;
    
    content = content.replace(formRegex, (match) => {
        const lowerMatch = match.toLowerCase();
        if (lowerMatch.includes('request personalized quote') || 
            lowerMatch.includes('submit request') || 
            lowerMatch.includes('send enquiry') ||
            lowerMatch.includes('submitting...')) {
            modified = true;
            return '<div id="enquiry-form-container"></div>';
        }
        return match;
    });

    // Replace the old script with the new one
    if (content.includes('assets/js/enquiry.js')) {
        content = content.replace('assets/js/enquiry.js', 'assets/js/enquiry-system.js');
        modified = true;
    } else if (!content.includes('assets/js/enquiry-system.js')) {
        // If no script was there, inject it
        if (content.includes('</body>')) {
            content = content.replace('</body>', `    <script src="assets/js/enquiry-system.js"></script>\n</body>`);
            modified = true;
        }
    }

    // Clean up any stray modal code if it exists (we inject it dynamically now)
    // There shouldn't be any, but just in case.

    if (modified) {
        fs.writeFileSync(file, content);
        console.log('Refactored', file);
    }
});
