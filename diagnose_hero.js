const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set a typical mobile viewport
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    
    // Load the page
    await page.goto('http://127.0.0.1:8080/', { waitUntil: 'load' });
    
    const getMetrics = async (label) => {
        return await page.evaluate((lbl) => {
            const hero = document.querySelector('section');
            const heroInner = hero ? hero.querySelector('.z-20') : null;
            const header = document.querySelector('header');
            
            const heroRect = hero ? hero.getBoundingClientRect() : null;
            const heroInnerRect = heroInner ? heroInner.getBoundingClientRect() : null;
            const headerRect = header ? header.getBoundingClientRect() : null;
            
            const heroStyle = hero ? window.getComputedStyle(hero) : null;
            const heroInnerStyle = heroInner ? window.getComputedStyle(heroInner) : null;
            
            return {
                label: lbl,
                window: {
                    innerHeight: window.innerHeight,
                    visualViewportHeight: window.visualViewport ? window.visualViewport.height : null,
                },
                header: headerRect ? { height: headerRect.height, top: headerRect.top, bottom: headerRect.bottom } : null,
                hero: heroRect ? { height: heroRect.height, top: heroRect.top, bottom: heroRect.bottom } : null,
                heroInner: heroInnerRect ? { height: heroInnerRect.height, top: heroInnerRect.top, bottom: heroInnerRect.bottom } : null,
                computedHero: heroStyle ? {
                    minHeight: heroStyle.minHeight,
                    height: heroStyle.height,
                    paddingTop: heroStyle.paddingTop,
                    paddingBottom: heroStyle.paddingBottom,
                    display: heroStyle.display,
                    flexDirection: heroStyle.flexDirection,
                } : null,
                computedInner: heroInnerStyle ? {
                    marginTop: heroInnerStyle.marginTop,
                    marginBottom: heroInnerStyle.marginBottom,
                } : null,
            };
        }, label);
    };

    console.log("--- BEFORE ANY INTERACTION ---");
    const before = await getMetrics("Initial Load");
    console.log(JSON.stringify(before, null, 2));

    // Wait a moment
    await new Promise(r => setTimeout(r, 1000));

    // Simulate opening DevTools/resize
    await page.setViewport({ width: 390, height: 800, isMobile: true });
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("\n--- AFTER RESIZE ---");
    const afterResize = await getMetrics("After Resize");
    console.log(JSON.stringify(afterResize, null, 2));

    // Simulate scroll
    await page.evaluate(() => window.scrollBy(0, 50));
    await new Promise(r => setTimeout(r, 1000));

    console.log("\n--- AFTER SCROLL ---");
    const afterScroll = await getMetrics("After Scroll");
    console.log(JSON.stringify(afterScroll, null, 2));

    await browser.close();
})();
