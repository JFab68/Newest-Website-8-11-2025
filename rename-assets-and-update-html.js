// Rename all asset folders/files to lowercase and hyphens, and update all HTML references.
// Run with Node.js: node rename-assets-and-update-html.js

const fs = require('fs');
const path = require('path');

// Utility to convert to lowercase and hyphens
function normalize(name) {
  return name.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase();
}

// Recursively rename folders/files
function renameRecursive(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const oldPath = path.join(dir, entry.name);
    const newName = normalize(entry.name);
    const newPath = path.join(dir, newName);
    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
    }
    if (fs.statSync(newPath).isDirectory()) {
      renameRecursive(newPath);
    }
  });
}

// Update all HTML references
function updateHtmlReferences(htmlFiles, assetBase) {
  htmlFiles.forEach(htmlFile => {
    let html = fs.readFileSync(htmlFile, 'utf8');
    // Find all src="10 Assets/..."
    html = html.replace(/src="(10 Assets[^"]+\.webp)"/g, (match, p1) => {
      // Normalize the path
      const parts = p1.split('/');
      const normParts = parts.map(normalize);
      return `src="${normParts.join('/')}"`;
    });
    fs.writeFileSync(htmlFile, html, 'utf8');
  });
}

function main() {
  const assetBase = path.join(__dirname, '10 Assets');
  // Step 1: Rename all folders/files
  renameRecursive(assetBase);

  // Step 2: Update all HTML and include files
  const htmlFiles = [
    '1 Homepage.html', '2 Issues.html', '3 About.html', '4 Programs.html',
    '4A prison_oversight_page.html', '4B criminal_legal_reform_page.html', '4C drug_policy_page.html',
    '4D civic_engagement_page.html', '4E arts_in_prison_page.html', '5 Action Center.html',
    '6 Partners.html', '7 News.html', '8 Contact.html', '9 Donate.html',
    'includes/header.html', 'includes/footer.html'
  ].map(f => path.join(__dirname, f)).filter(f => fs.existsSync(f));
  updateHtmlReferences(htmlFiles, assetBase);

  console.log('All asset folders/files renamed and HTML references updated.');
}

main();
