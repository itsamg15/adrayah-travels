/**
 * fix_stub_recursion.js
 *
 * BUG: The previous fix introduced an infinite-recursion stub on 4 regional pages.
 *
 * On north-india, south-india, east-india, west-india the inline script contains:
 *
 *   function openEnquiryModal(destination) {
 *       document.addEventListener('DOMContentLoaded', function() {
 *           if (window.openEnquiryModal) window.openEnquiryModal(destination);
 *       });
 *   }
 *
 * DOMContentLoaded has ALREADY fired when a user clicks a button.
 * So addEventListener fires the callback IMMEDIATELY and synchronously.
 * window.openEnquiryModal is THIS SAME STUB (enquiry-system.js sets it inside
 * DOMContentLoaded, but the inline function declaration SHADOWS it as a named
 * function in global scope, so window.openEnquiryModal returns the stub).
 * Result: infinite recursion → stack overflow → silent crash → modal never opens.
 *
 * FIX: Replace the broken <!-- Scripts for Interactions --> block with a version
 * that contains NO openEnquiryModal or openCallbackModal stubs at all.
 * enquiry-system.js (deferred) sets window.openEnquiryModal via DOMContentLoaded.
 * Since defer guarantees the script runs after HTML is parsed (before/at
 * DOMContentLoaded), window.openEnquiryModal is always defined before any user
 * can click a button.  No stub is needed.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Only the four broken regional pages need this specific fix
const TARGET_FILES = [
    'north-india.html',
    'south-india.html',
    'east-india.html',
    'west-india.html',
];

// The clean replacement: ONLY the scroll strip. No modal stubs at all.
// enquiry-system.js owns openEnquiryModal, openCallbackModal, and closeModals.
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

// Matches the full <!-- Scripts for Interactions --> ... </script> block
const BLOCK_REGEX = /<!-- Scripts for Interactions -->\s*<script>[\s\S]*?<\/script>/;

let fixedCount = 0;

for (const filename of TARGET_FILES) {
    const filepath = path.join(ROOT, filename);

    if (!fs.existsSync(filepath)) {
        console.log(`SKIP (not found): ${filename}`);
        continue;
    }

    let content = fs.readFileSync(filepath, 'utf8');

    if (!BLOCK_REGEX.test(content)) {
        console.log(`SKIP (block not found): ${filename}`);
        continue;
    }

    const newContent = content.replace(BLOCK_REGEX, CLEAN_SCRIPT_BLOCK);

    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log(`FIXED: ${filename}`);
    fixedCount++;
}

console.log(`\nDone. Fixed ${fixedCount} file(s).`);
