const fs = require('fs');

try {
    const report = JSON.parse(fs.readFileSync('lh-report.json', 'utf8'));

    // 1. Caching issues
    const caching = report.audits['uses-long-cache-ttl'];
    if (caching && caching.details && caching.details.items) {
        console.log('\n--- CACHING ISSUES ---');
        caching.details.items.forEach(i => {
            console.log(`URL: ${i.url} | Size: ${Math.round(i.totalBytes / 1024)} KB | Wasted: ${Math.round(i.wastedBytes / 1024)} KB`);
        });
    }

    // 2. Image Optimization (Improve image delivery)
    const modernFormat = report.audits['modern-image-formats'];
    const offscreen = report.audits['offscreen-images'];
    const responsive = report.audits['uses-responsive-images'];
    const optimized = report.audits['uses-optimized-images'];

    console.log('\n--- IMAGE OPTIMIZATION ---');
    if (modernFormat && modernFormat.details && modernFormat.details.items) {
        console.log('Modern Formats:');
        modernFormat.details.items.forEach(i => console.log(`  ${i.url}`));
    }
    if (responsive && responsive.details && responsive.details.items) {
        console.log('Responsive Sizes (wasted bytes):');
        responsive.details.items.forEach(i => console.log(`  ${i.url} | Wasted: ${Math.round(i.wastedBytes / 1024)} KB`));
    }
    if (optimized && optimized.details && optimized.details.items) {
        console.log('Optimized Images:');
        optimized.details.items.forEach(i => console.log(`  ${i.url}`));
    }
    if (offscreen && offscreen.details && offscreen.details.items) {
        console.log('Offscreen Images:');
        offscreen.details.items.forEach(i => console.log(`  ${i.url}`));
    }

    // 3. Accessibility Issues
    console.log('\n--- ACCESSIBILITY ISSUES ---');
    const a11yCategory = report.categories.accessibility;
    if (a11yCategory) {
        a11yCategory.auditRefs.forEach(ref => {
            const audit = report.audits[ref.id];
            if (audit && audit.score !== 1 && audit.score !== null) {
                console.log(`\nIssue: ${audit.title} (${audit.id})`);
                if (audit.details && audit.details.items) {
                    audit.details.items.forEach(i => {
                        const selector = i.node ? i.node.selector : 'N/A';
                        const snippet = i.node ? i.node.snippet : 'N/A';
                        console.log(`  Element: ${selector}`);
                        console.log(`  Snippet: ${snippet}`);
                    });
                }
            }
        });
    }
} catch (e) {
    console.error("Failed to parse report:", e);
}
