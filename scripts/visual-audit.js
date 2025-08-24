const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const RESULTS_DIR = 'visual-audit-results';

// Define the pages to audit. Add any other HTML files you want to test.
const pagesToAudit = [
    { name: 'homepage', path: '/1%20Homepage.html' },
    { name: 'issues', path: '/2%20Issues.html' },
    { name: 'about', path: '/3%20About.html' },
    { name: 'programs', path: '/4%20Programs.html' },
    { name: 'program-prison-oversight', path: '/4A%20prison_oversight_page.html' },
    { name: 'program-criminal-reform', path: '/4B%20criminal_legal_reform_page.html' },
    { name: 'program-drug-policy', path: '/4C%20drug_policy_page.html' },
    { name: 'program-civic-engagement', path: '/4D%20civic_engagement_page.html' },
    { name: 'program-arts-in-prison', path: '/4E%20arts_in_prison_page.html' },
    { name: 'action-center', path: '/5%20Action%20Center.html' },
    { name: 'partners', path: '/6%20Partners.html' },
    { name: 'news', path: '/7%20News.html' },
    { name: 'contact', path: '/8%20Contact.html' },
    { name: 'donate', path: '/9%20Donate.html' },
];

// Define the viewports for different devices
const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
];

(async () => {
    // --- Setup ---
    console.log('Starting visual audit...');
    if (!fs.existsSync(RESULTS_DIR)) {
        fs.mkdirSync(RESULTS_DIR);
        console.log(`Created directory: ${RESULTS_DIR}`);
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // --- Audit Loop ---
    for (const pageInfo of pagesToAudit) {
        const url = `${BASE_URL}${pageInfo.path}`;
        try {
            await page.goto(url, { waitUntil: 'networkidle' });
            console.log(`\nAuditing page: ${pageInfo.name} (${url})`);

            for (const viewport of viewports) {
                console.log(`  - Capturing ${viewport.name} view...`);
                await page.setViewportSize({
                    width: viewport.width,
                    height: viewport.height,
                });

                // Wait a moment for any animations or lazy-loaded content
                await new Promise(resolve => setTimeout(resolve, 500));

                const screenshotPath = `${RESULTS_DIR}/${pageInfo.name}-${viewport.name}.png`;
                await page.screenshot({ path: screenshotPath, fullPage: true });
                console.log(`    Screenshot saved to: ${screenshotPath}`);
            }
        } catch (error) {
            console.error(`Failed to audit ${url}. Is the local server running?`);
            console.error(error);
        }
    }

    // --- Teardown ---
    await browser.close();
    console.log('\nVisual audit complete!');
    console.log(`Check the '${RESULTS_DIR}' folder for screenshots.`);
})();