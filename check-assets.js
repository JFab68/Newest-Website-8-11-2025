// This script checks for mismatches between image references in HTML files and actual files in the asset folders.
// Run with Node.js: node check-assets.js

const fs = require('fs');
const path = require('path');

const assetBase = path.join(__dirname, '10 Assets');
const htmlGlob = [
  '1 Homepage.html', '2 Issues.html', '3 About.html', '4 Programs.html',
  '4A prison_oversight_page.html', '4B criminal_legal_reform_page.html', '4C drug_policy_page.html',
  '4D civic_engagement_page.html', '4E arts_in_prison_page.html', '5 Action Center.html',
  '6 Partners.html', '7 News.html', '8 Contact.html', '9 Donate.html',
  'includes/header.html', 'includes/footer.html'
];

function getAllAssetFiles(dir) {
  let results = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllAssetFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

function extractImageRefs(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const regex = /src\s*=\s*"([^"]+\.webp)"/g;
  let match, refs = [];
  while ((match = regex.exec(html))) {
    refs.push(match[1]);
  }
  return refs;
}

function main() {
  const assetFiles = getAllAssetFiles(assetBase).map(f => f.replace(/\\/g, '/'));
  let missing = [];
  let found = [];
  htmlGlob.forEach(htmlFile => {
    const htmlPath = path.join(__dirname, htmlFile);
    if (!fs.existsSync(htmlPath)) return;
    const refs = extractImageRefs(htmlPath);
    refs.forEach(ref => {
      const assetPath = path.join(__dirname, ref).replace(/\\/g, '/');
      if (assetFiles.includes(assetPath)) {
        found.push(ref);
      } else {
        missing.push(ref);
      }
    });
  });
  console.log('Missing asset references:');
  missing.forEach(m => console.log(m));
  console.log('\nFound asset references:');
  found.forEach(f => console.log(f));
}

main();
