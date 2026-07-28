/**
 * fix_enquiry_system.js
 * 
 * ROOT CAUSE: Every destination page has a broken inline <script> block
 * (<!-- Scripts for Interactions -->) that references DOM elements
 * (modal-container, enquiry-modal, callback-modal, exit-modal) that no longer
 * exist in the HTML. This causes a TypeError at line:
 *   modalContainer.addEventListener('click', ...)  // modalContainer is null → CRASH
 * 
 * The crash kills the entire script block, making openEnquiryModal unreachable.
 * enquiry-system.js's window.openEnquiryModal is never established correctly
 * because the inline function declaration shadows it, and that inline version
 * crashes when called (enquiryModal is null → showModal(null) crashes).
 * 
 * FIX:
 * 1. Replace the broken <!-- Scripts for Interactions --> block on every HTML
 *    page with a clean version that only contains safe, working logic:
 *    - Scroll strip logic (safe - references conversion-strip which exists)
 *    - openCallbackModal / openEnquiryModal stubs that delegate to enquiry-system.js
 * 2. The deferred enquiry-system.js then runs after DOM is ready and sets
 *    window.openEnquiryModal correctly. Buttons call it and the modal opens.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// All HTML files to fix (excludes index_backup.html)
const TARGET_FILES = [
    'index.html',
    'north-india.html',
    'south-india.html',
    'east-india.html',
    'west-india.html',
    'special-tours.html',
    'kashmir-escape.html',
    'himachal-explorer.html',
    'kerala-retreat.html',
    'meghalaya-discovery.html',
    'rajasthan-royal-circuit.html',
    'contact.html',
    '404.html',
];

/**
 * The clean replacement script block.
 * - Keeps the scroll strip logic (it's safe and the element exists on pages that have it)
 * - Removes ALL references to modal-container, enquiry-modal, callback-modal, exit-modal
 * - openEnquiryModal and openCallbackModal are stub-safe: if enquiry-system.js
 *   has already set window.openEnquiryModal, those stubs are never called.
 *   If somehow called before enquiry-system.js loads (impossible with defer),
 *   they are no-ops that don't crash.
 * - enquiry-system.js (deferred) sets window.openEnquiryModal authoritatively.
 *   openCallbackModal is now also defined there.
 */
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

    // openEnquiryModal and openCallbackModal are defined by enquiry-system.js (deferred).
    // These stubs prevent "function not defined" errors on inline onclick handlers
    // that fire before the deferred script runs (e.g., if page has inline onclick
    // in noscript or before DOMContentLoaded). They are replaced by enquiry-system.js.
    function openEnquiryModal(destination) {
        // Delegate to the version set by enquiry-system.js once it loads.
        // enquiry-system.js uses DOMContentLoaded + defer so this stub is
        // only ever called if a button is clicked before DOMContentLoaded fires,
        // which is practically impossible. Safe no-op fallback.
        document.addEventListener('DOMContentLoaded', function() {
            if (window.openEnquiryModal) window.openEnquiryModal(destination);
        });
    }

    function openCallbackModal() {
        // Callback modal is handled by enquiry-system.js which opens the enquiry modal.
        document.addEventListener('DOMContentLoaded', function() {
            if (window.openEnquiryModal) window.openEnquiryModal('General');
        });
    }

    function closeModals() {
        // Safe stub - enquiry-system.js manages its own modal close logic.
        var modal = document.getElementById('universal-enquiry-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
</script>`;

// Regex to match the broken <!-- Scripts for Interactions --> ... </script> block.
// It matches from the comment through to the closing </script> tag.
// Uses non-greedy match to only capture one script block.
const BROKEN_BLOCK_REGEX = /<!-- Scripts for Interactions -->\s*<script>[\s\S]*?<\/script>/;

let fixedCount = 0;
let skippedCount = 0;
let errorCount = 0;

for (const filename of TARGET_FILES) {
    const filepath = path.join(ROOT, filename);
    
    if (!fs.existsSync(filepath)) {
        console.log(`⚠️  SKIP (not found): ${filename}`);
        skippedCount++;
        continue;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    if (!BROKEN_BLOCK_REGEX.test(content)) {
        console.log(`⚠️  SKIP (no broken block found): ${filename}`);
        skippedCount++;
        continue;
    }
    
    // Verify the block contains the dangerous null-crash line
    const match = content.match(BROKEN_BLOCK_REGEX);
    if (match && !match[0].includes('modal-container') && !match[0].includes('openEnquiryModal')) {
        console.log(`⚠️  SKIP (script block looks different): ${filename}`);
        skippedCount++;
        continue;
    }
    
    const newContent = content.replace(BROKEN_BLOCK_REGEX, CLEAN_SCRIPT_BLOCK);
    
    if (newContent === content) {
        console.log(`⚠️  SKIP (replacement produced no change): ${filename}`);
        skippedCount++;
        continue;
    }
    
    try {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`✅ FIXED: ${filename}`);
        fixedCount++;
    } catch (err) {
        console.error(`❌ ERROR writing ${filename}: ${err.message}`);
        errorCount++;
    }
}

console.log(`\n=== Summary ===`);
console.log(`Fixed:   ${fixedCount}`);
console.log(`Skipped: ${skippedCount}`);
console.log(`Errors:  ${errorCount}`);
