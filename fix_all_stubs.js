/**
 * fix_all_stubs.js — Final cleanup pass.
 * Removes the recursive openEnquiryModal/openCallbackModal stubs from ALL pages.
 * enquiry-system.js (deferred) owns these functions exclusively.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const TARGET_FILES = [
    'index.html',
    'kashmir-escape.html',
    'himachal-explorer.html',
    'meghalaya-discovery.html',
    'rajasthan-royal-circuit.html',
    'contact.html',
    '404.html',
];

const CLEAN_SCRIPT_BLOCK = `<!-- Scripts for Interactions -->
<script>
    // Sticky conversion strip scroll reveal
    (function() {
        var strip = null;
        window.addEventListener('scroll', function() {
            if (!strip) strip = document.getElementById('conversion-strip');
            if (!strip) return;
            if (window.scrollY > 500) {
                strip.classList.remove('translate-y-full');
            } else {
                strip.classList.add('translate-y-full');
            }
        });
    })();
</script>`;

const BLOCK_REGEX = /<!-- Scripts for Interactions -->\s*<script>[\s\S]*?<\/script>/;

let fixedCount = 0;
for (const filename of TARGET_FILES) {
    const filepath = path.join(ROOT, filename);
    if (!fs.existsSync(filepath)) { console.log(`SKIP (not found): ${filename}`); continue; }
    let content = fs.readFileSync(filepath, 'utf8');
    if (!BLOCK_REGEX.test(content)) { console.log(`SKIP (no block): ${filename}`); continue; }
    const newContent = content.replace(BLOCK_REGEX, CLEAN_SCRIPT_BLOCK);
    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log(`FIXED: ${filename}`);
    fixedCount++;
}
console.log(`\nDone. Fixed ${fixedCount} file(s).`);
