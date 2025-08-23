# Praxis Initiative Website

A responsive website for Praxis Initiative, Arizona's only directly impacted-led 501(c)(3) nonprofit dedicated to transforming the criminal legal system.

## 🚀 Quick Deploy to Netlify

### Method 1: GitHub + Netlify (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Praxis Initiative website"
   git branch -M main
   git remote add origin https://github.com/yourusername/praxis-initiative-website.git
   git push -u origin main
   ```

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: (leave empty or enter ".")
   - Click "Deploy site"

### Method 2: Direct File Upload

1. Zip the entire website folder
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the zip file onto the deploy area
4. Your site will be live immediately!

## 📁 File Structure

```
/
├── 1 Homepage.html         # Primary homepage
├── 2 Issues.html           # Issues page  
├── 3 About.html            # About page
├── 4 Programs.html         # Programs page
├── 4A prison_oversight_page.html        # Independent prison oversight page
├── 4B criminal_legal_reform_page.html   # Criminal legal reform page
├── 4C drug_policy_page.html             # Drug policy page
├── 4D civic_engagement_page.html        # Civic engagement page
├── 4E arts_in_prison_page.html          # Arts in prison page
├── 5 Action Center.html    # Action Center
├── 6 Partners.html         # Partners page
├── 7 News.html            # News page
├── 8 Contact.html         # Contact page
├── 9 Donate.html          # Donation page
├── css/
│   └── styles.css         # Global CSS styles
├── js/
│   └── components.js      # Global JavaScript components
├── includes/
│   ├── header.html        # Global header
│   └── footer.html        # Global footer
├── 10 Assets/             # Images and media files
├── netlify.toml           # Netlify configuration
└── README.md              # This file
```

## 🔧 Features

- **Responsive Design**: Works on all devices
- **Global Components**: Reusable header and footer
- **SEO Optimized**: Proper meta tags and structure
- **Fast Loading**: Optimized assets and caching
- **Accessibility**: WCAG compliant structure

## 🛠️ Customization

### Updating Global Header/Footer
Edit files in the `/includes/` directory:
- `header.html` - Navigation and logo
- `footer.html` - Footer links and social media

### Adding New Pages
1. Create new HTML file
2. Include global header/footer divs:
   ```html
   <div id="global-header"></div>
   <!-- Your content -->
   <div id="global-footer"></div>
   ```
3. Add CSS link and components.js script

### Building the Site
Run `npm run build` to generate a `dist/` directory with static pages.
Deploy the contents of `dist/` to your hosting provider.

### Styling
Main styles are in `/css/styles.css`. Use CSS variables for consistent colors:
- `--primary-navy`: #000080
- `--secondary-maroon`: #800000
- `--urgent-red`: #dc3545

## 📧 Contact Information

For website updates or technical support, contact the Praxis Initiative team.

## 📄 License

This website is for Praxis Initiative, a 501(c)(3) nonprofit organization.
"# Praxis-8.19.25-Build" 
