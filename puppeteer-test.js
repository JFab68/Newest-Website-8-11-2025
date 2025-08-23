const puppeteer = require('puppeteer');
const pages = [
  '1 Homepage.html',
  '2 Issues.html',
  '3 About.html',
  '4 Programs.html',
  '4A prison_oversight_page.html',
  '4B criminal_legal_reform_page.html',
  '4C drug_policy_page.html',
  '4D civic_engagement_page.html',
  '4E arts_in_prison_page.html',
  '5 Action Center.html',
  '6 Partners.html',
  '7 News.html',
  '8 Contact.html',
  '9 Donate.html'
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (const htmlFile of pages) {
    const url = `http://localhost:8080/${encodeURIComponent(htmlFile)}`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `${htmlFile}.png`, fullPage: true });
    console.log(`Screenshot taken for ${htmlFile}`);
  }
  await browser.close();
})();


