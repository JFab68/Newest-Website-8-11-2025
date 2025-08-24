const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = 'screenshots';
const PROJECT_ROOT = path.resolve(__dirname, '..'); // Assumes this script is in a 'scripts' folder

// --- Helper Functions ---

/**
 * Finds all top-level HTML files in the project root.
 * This automatically discovers pages like "1 Homepage.html", "2 Issues.html", etc.
 * and excludes program sub-pages like "4A prison_oversight_page.html".
 * @returns {Array<{name: string, path: string}>}
 */
function findHtmlFilesToAudit() {
    console.log(`🔎 Searching for HTML files in: ${PROJECT_ROOT}`);
    const files = fs.readdirSync(PROJECT_ROOT);
    return files
        .filter(file => file.endsWith('.html') && /^\d\s/.test(file)) // Matches "1 ", "2 ", etc.
        .map(file => {
            // Create a more readable name from the filename for screenshots
            const name = path.basename(file, '.html')
                .replace(/^\d+\s*/, '') // Remove leading numbers
                .replace(/_/g, ' ')    // Replace underscores
                .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
            return { name, path: `/${encodeURI(file)}` };
        });
}

/**
 * Checks if a given selector exists and is visible on the page.
 * @param {import('puppeteer').Page} page - The Puppeteer page object.
 * @param {string} selector - The CSS selector to check.
 * @param {string} elementName - A friendly name for the element being checked.
 * @returns {Promise<boolean>} - True if the element is found and visible, false otherwise.
 */
async function checkElementIsPresent(page, selector, elementName) {
    const element = await page.$(selector);
    if (!element) {
        console.error(`❌ FAILED: ${elementName} (selector: ${selector}) was not found.`);
        return false;
    }

    // Check if the element has a size. It might be off-screen but still rendered.
    const box = await element.boundingBox();
    if (box && box.width > 0 && box.height > 0) {
        console.log(`👍 SUCCESS: ${elementName} (selector: ${selector}) was found.`);
        return true;
    }
    
    console.error(`❌ FAILED: ${elementName} (selector: ${selector}) was found but is not visible (has no size).`);
    return false;
}


// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR);
    console.log(`Created directory: ${SCREENSHOTS_DIR}`);
}

(async () => {
    console.log('🚀 Starting visual audit...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const pagesToAudit = findHtmlFilesToAudit();
    if (pagesToAudit.length === 0) {
        console.error("❌ No HTML files found to audit. Make sure this script is inside a 'scripts' folder at the project root.");
        await browser.close();
        return;
    }
    console.log(`Found ${pagesToAudit.length} pages to audit.`);

    for (const pageInfo of pagesToAudit) {
        const url = `${BASE_URL}${pageInfo.path}`;
        console.log(`\n➡️  Auditing ${pageInfo.name} at ${url}`);

        try {
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Wait for a moment to ensure our JS component loader and animations complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // --- Generic Checks for Every Page ---
            console.log('   🔎 Verifying global components...');
            await checkElementIsPresent(page, '#global-header .header-container', 'Global Header');
            await checkElementIsPresent(page, '#global-footer .footer-grid', 'Global Footer');

            // --- Page-Specific Checks ---
            if (pageInfo.name.includes('Homepage')) {
                console.log('   🔎 Running Homepage-specific checks...');
                const cards = await page.$$('.change-card');
                if (cards.length > 0) {
                    console.log(`   👍 SUCCESS: Found ${cards.length} homepage cards.`);
                } else {
                    console.error(`   ❌ CRITICAL: No homepage cards found. This confirms the rendering issue.`);
                }
            }

            const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageInfo.name.replace(/\s+/g, '-')}.png`);
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`   ✅ Screenshot saved to ${screenshotPath}`);
        } catch (error) {
            console.error(`❌ Failed to audit ${pageInfo.name}: ${error.message}`);
        }
    }

    await browser.close();
    console.log('\n🎉 Visual audit complete. Please review the images in the screenshots/ folder.');
})();
