/**
 * compare_pages.js
 * Structurally compares broken vs working pages to find the real difference
 * in how enquiry buttons, scripts, and modal HTML are wired.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function analyze(filename) {
    const filepath = path.join(ROOT, filename);
    const html = fs.readFileSync(filepath, 'utf8');
    const lines = html.split('\n');

    const results = {
        filename,
        totalLines: lines.length,
        enquirySystemScriptTag: null,
        mobileNavScriptTag: null,
        modalHTMLPresent: html.includes('universal-enquiry-modal'),
        enquiryFormContainerCount: (html.match(/id="enquiry-form-container"/g) || []).length,
        openEnquiryModalCalls: [],
        openEnquiryModalDefinitions: [],
        openCallbackModalDefinitions: [],
        inlineScriptBlocks: [],
        enquiryButtons: [],
        conversionStripPresent: html.includes('id="conversion-strip"'),
        deferredScripts: [],
        headScripts: [],
    };

    // Find script tags
    const scriptTagRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    const srcScriptRegex = /<script([^>]*)>/gi;
    let m;

    // Find src scripts (deferred)
    const allLines = html;
    const srcMatches = allLines.match(/<script[^>]+src="[^"]*"[^>]*>/gi) || [];
    srcMatches.forEach(tag => {
        if (tag.includes('enquiry-system')) results.enquirySystemScriptTag = tag.trim();
        if (tag.includes('mobile-nav')) results.mobileNavScriptTag = tag.trim();
        results.deferredScripts.push(tag.trim());
    });

    // Find inline script content
    const inlineScriptRegex = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptMatch;
    while ((scriptMatch = inlineScriptRegex.exec(html)) !== null) {
        const content = scriptMatch[1].trim();
        if (content.length > 0) {
            results.inlineScriptBlocks.push({
                lineNum: html.substring(0, scriptMatch.index).split('\n').length,
                preview: content.substring(0, 300),
                hasOpenEnquiryModal: content.includes('openEnquiryModal'),
                hasModalContainer: content.includes('modal-container'),
                hasUniversalModal: content.includes('universal-enquiry-modal'),
                length: content.length,
            });
        }
    }

    // Find all onclick buttons with openEnquiryModal
    const onclickRegex = /onclick="[^"]*openEnquiryModal[^"]*"/gi;
    const onclickMatches = html.match(onclickRegex) || [];
    results.openEnquiryModalCalls = onclickMatches;

    // Find function definitions
    if (html.includes('function openEnquiryModal')) {
        const defRegex = /function openEnquiryModal[^{]*\{[^}]*\}/gs;
        const defs = html.match(defRegex) || [];
        results.openEnquiryModalDefinitions = defs.map(d => d.trim().substring(0, 200));
    }

    // Find enquiry buttons HTML (the actual <a> or <button> elements)
    const btnRegex = /<(?:a|button)[^>]*onclick="[^"]*openEnquiryModal[^"]*"[^>]*>[\s\S]*?<\/(?:a|button)>/gi;
    let btnMatch;
    while ((btnMatch = btnRegex.exec(html)) !== null) {
        results.enquiryButtons.push({
            lineNum: html.substring(0, btnMatch.index).split('\n').length,
            html: btnMatch[0].replace(/\s+/g, ' ').substring(0, 300),
        });
    }

    return results;
}

const broken = ['north-india.html', 'south-india.html', 'east-india.html', 'west-india.html'];
const working = ['kerala-retreat.html', 'kashmir-escape.html'];

console.log('='.repeat(80));
console.log('BROKEN PAGES ANALYSIS');
console.log('='.repeat(80));
broken.forEach(f => {
    const r = analyze(f);
    console.log(`\n--- ${r.filename} (${r.totalLines} lines) ---`);
    console.log(`  enquiry-system.js tag:  ${r.enquirySystemScriptTag}`);
    console.log(`  universal-enquiry-modal present: ${r.modalHTMLPresent}`);
    console.log(`  enquiry-form-container count: ${r.enquiryFormContainerCount}`);
    console.log(`  function openEnquiryModal definitions: ${r.openEnquiryModalDefinitions.length}`);
    console.log(`  inline script blocks: ${r.inlineScriptBlocks.length}`);
    r.inlineScriptBlocks.forEach((b, i) => {
        console.log(`    Block ${i+1} (line ${b.lineNum}, ${b.length} chars): hasOpenEnquiryModal=${b.hasOpenEnquiryModal}, hasModalContainer=${b.hasModalContainer}`);
        console.log(`    Preview: ${b.preview.substring(0, 150).replace(/\n/g, ' ')}`);
    });
    console.log(`  Enquiry buttons found: ${r.enquiryButtons.length}`);
    r.enquiryButtons.slice(0, 3).forEach(b => {
        console.log(`    Line ${b.lineNum}: ${b.html}`);
    });
    console.log(`  Deferred scripts: ${JSON.stringify(r.deferredScripts)}`);
});

console.log('\n' + '='.repeat(80));
console.log('WORKING PAGES ANALYSIS');
console.log('='.repeat(80));
working.forEach(f => {
    const r = analyze(f);
    console.log(`\n--- ${r.filename} (${r.totalLines} lines) ---`);
    console.log(`  enquiry-system.js tag:  ${r.enquirySystemScriptTag}`);
    console.log(`  universal-enquiry-modal present: ${r.modalHTMLPresent}`);
    console.log(`  enquiry-form-container count: ${r.enquiryFormContainerCount}`);
    console.log(`  function openEnquiryModal definitions: ${r.openEnquiryModalDefinitions.length}`);
    console.log(`  inline script blocks: ${r.inlineScriptBlocks.length}`);
    r.inlineScriptBlocks.forEach((b, i) => {
        console.log(`    Block ${i+1} (line ${b.lineNum}, ${b.length} chars): hasOpenEnquiryModal=${b.hasOpenEnquiryModal}, hasModalContainer=${b.hasModalContainer}`);
        console.log(`    Preview: ${b.preview.substring(0, 150).replace(/\n/g, ' ')}`);
    });
    console.log(`  Enquiry buttons found: ${r.enquiryButtons.length}`);
    r.enquiryButtons.slice(0, 3).forEach(b => {
        console.log(`    Line ${b.lineNum}: ${b.html}`);
    });
    console.log(`  Deferred scripts: ${JSON.stringify(r.deferredScripts)}`);
});
