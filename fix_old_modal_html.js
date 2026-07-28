/**
 * fix_old_modal_html.js
 *
 * ROOT CAUSE (CONFIRMED):
 * north-india, south-india, east-india, west-india still contain the old
 * modal HTML block in the page body:
 *
 *   <div class="fixed inset-0 z-[100]..." id="modal-container">
 *     <div id="callback-modal">
 *       <div id="enquiry-form-container"></div>  ← enquiry-system.js finds THIS first
 *     </div>
 *     <div id="enquiry-modal">
 *       <div id="enquiry-form-container"></div>  ← duplicate ID, ignored by getElementById
 *     </div>
 *     <div id="exit-modal">...</div>
 *   </div>
 *
 * enquiry-system.js calls document.getElementById('enquiry-form-container')
 * which returns the FIRST match — inside the old hidden modal-container.
 * The form is injected there (hidden, invisible, never shown).
 * The universal-enquiry-modal appended by enquiry-system.js has an empty form wrapper.
 * Result: modal opens but shows nothing, OR the modal doesn't visually respond.
 *
 * FIX: Remove the entire old modal-container block from all 4 broken pages.
 */

const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const TARGET_FILES = [
    'north-india.html',
    'south-india.html',
    'east-india.html',
    'west-india.html',
    'rajasthan-royal-circuit.html',
    'meghalaya-discovery.html',
    'kashmir-escape.html',
    'himachal-explorer.html',
    'index.html',
    'contact.html',
    '404.html',
];

// The old modal block starts with this fixed inset-0 modal-container div.
// We need to remove it entirely. It ends with </div>\n</div> before <!-- Scripts for Interactions -->
// Strategy: find the div#modal-container opening and remove through its matching close.

function removeModalContainer(content) {
    // Find the start of the old modal block
    const startMarker = '<div class="fixed inset-0';
    const idMarker = 'id="modal-container"';
    
    // Find the exact position where modal-container div starts
    let startIdx = -1;
    let searchFrom = 0;
    while (true) {
        const idx = content.indexOf(startMarker, searchFrom);
        if (idx === -1) break;
        // Check if this specific div has id="modal-container"
        const snippet = content.substring(idx, idx + 200);
        if (snippet.includes(idMarker)) {
            startIdx = idx;
            break;
        }
        searchFrom = idx + 1;
    }
    
    if (startIdx === -1) {
        return { content, removed: false, reason: 'modal-container start not found' };
    }
    
    // Now find the matching closing </div> by counting depth
    // The modal-container opens at startIdx, we need to find its closing tag
    let depth = 0;
    let i = startIdx;
    const len = content.length;
    
    while (i < len) {
        if (content[i] === '<') {
            if (content.substring(i, i + 2) === '</') {
                // Closing tag
                const closeEnd = content.indexOf('>', i);
                if (closeEnd === -1) break;
                const tag = content.substring(i + 2, closeEnd).trim().split(/\s/)[0];
                if (tag === 'div') {
                    depth--;
                    if (depth === 0) {
                        // This is the closing tag of modal-container
                        const endIdx = closeEnd + 1;
                        // Remove from startIdx to endIdx, including any trailing newline
                        const before = content.substring(0, startIdx);
                        let after = content.substring(endIdx);
                        // Remove leading whitespace/newline after the removed block
                        after = after.replace(/^\s*\n/, '\n');
                        return {
                            content: before + after,
                            removed: true,
                            removedLength: endIdx - startIdx,
                        };
                    }
                }
                i = closeEnd + 1;
            } else {
                // Opening tag — check if it's a div (self-closing or not)
                const tagEnd = content.indexOf('>', i);
                if (tagEnd === -1) break;
                const tagContent = content.substring(i + 1, tagEnd);
                const tagName = tagContent.trim().split(/[\s/]/)[0];
                // Only count non-self-closing divs
                if (tagName === 'div' && !tagContent.trimEnd().endsWith('/')) {
                    depth++;
                }
                i = tagEnd + 1;
            }
        } else {
            i++;
        }
    }
    
    return { content, removed: false, reason: 'Could not find matching closing tag' };
}

let fixedCount = 0;
for (const filename of TARGET_FILES) {
    const filepath = path.join(ROOT, filename);
    if (!fs.existsSync(filepath)) {
        console.log(`SKIP (not found): ${filename}`);
        continue;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    if (!content.includes('id="modal-container"')) {
        console.log(`SKIP (no modal-container): ${filename}`);
        continue;
    }
    
    const result = removeModalContainer(content);
    
    if (!result.removed) {
        console.log(`ERROR in ${filename}: ${result.reason}`);
        continue;
    }
    
    // Verify the result no longer has the old modal HTML
    if (result.content.includes('id="modal-container"')) {
        console.log(`ERROR: modal-container still present in ${filename} after removal`);
        continue;
    }
    
    // Verify enquiry-system.js script tag is still present
    if (!result.content.includes('enquiry-system.js')) {
        console.log(`ERROR: enquiry-system.js tag was accidentally removed from ${filename}`);
        continue;
    }
    
    fs.writeFileSync(filepath, result.content, 'utf8');
    console.log(`FIXED: ${filename} — removed ${result.removedLength} chars of old modal HTML`);
    fixedCount++;
}

console.log(`\nDone. Fixed ${fixedCount} file(s).`);

// Final verification
console.log('\n--- Verification ---');
for (const filename of TARGET_FILES) {
    const filepath = path.join(ROOT, filename);
    if (!fs.existsSync(filepath)) continue;
    const content = fs.readFileSync(filepath, 'utf8');
    const hasOldModal = content.includes('id="modal-container"');
    const hasEnquirySystem = content.includes('enquiry-system.js');
    const formContainerCount = (content.match(/id="enquiry-form-container"/g) || []).length;
    console.log(`${filename}: old-modal=${hasOldModal}, enquiry-system=${hasEnquirySystem}, form-container-count=${formContainerCount}`);
}
