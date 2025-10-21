# 🎉 Festival Countdown Finder

A beautiful, SEO-optimized festival countdown website that automatically deploys on every commit. Features individual event pages with shareable URLs, perfect for festivals like Diwali, Christmas, New Year, and more.

## ✨ Features

- **🚀 Auto-Deployment**: Automatically deploys to GitHub Pages on every commit
- **🔗 SEO-Optimized URLs**: Individual pages for each festival (e.g., `/diwali`, `/christmas`)
- **📱 Share Functionality**: Share countdowns on Facebook, Twitter, WhatsApp, or copy links
- **🎨 Beautiful UI**: Modern, responsive design with dark theme
- **⚡ Real-time Countdowns**: Live countdown timers with smooth animations
- **🔍 Search Engine Optimized**: Complete SEO setup with meta tags, sitemap, and structured data
- **📊 Admin Panel**: Manage event submissions and approvals

## 🌐 Live URLs

- **Main Site**: `https://festcountdown.com`
- **Diwali Countdown**: `https://festcountdown.com/diwali`
- **Christmas Countdown**: `https://festcountdown.com/christmas`
- **New Year Countdown**: `https://festcountdown.com/new-year`
- **Gandhi Jayanti**: `https://festcountdown.com/gandhi-jayanti`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git repository set up
- GitHub Pages enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/festcountdown.git
   cd festcountdown
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```
   Open `http://localhost:8000` in your browser

### Deployment Setup

1. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to Pages section
   - Select "GitHub Actions" as source

2. **Configure Domain (Optional)**
   - Update `CNAME` in `.github/workflows/deploy.yml`
   - Replace `festcountdown.com` with your domain

3. **Push to Deploy**
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

The GitHub Action will automatically:
- Build the project
- Generate individual event pages
- Create sitemap.xml and robots.txt
- Deploy to GitHub Pages

## 📁 Project Structure

```
festcountdown/
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions deployment
├── scripts/
│   └── generate-event-pages.js  # Dynamic page generation
├── images/                 # Festival images
├── index.html             # Main homepage
├── event.html             # Event page template
├── admin.html             # Admin panel
├── script.js              # Main JavaScript
├── style.css              # Styling
├── package.json           # Dependencies
├── robots.txt             # SEO robots file
└── README.md              # This file
```

## 🎯 SEO Features

### Individual Event Pages
Each festival gets its own optimized page:
- **URL**: `/festival-name` (e.g., `/diwali`)
- **Meta Tags**: Title, description, keywords
- **Open Graph**: Facebook sharing optimization
- **Twitter Cards**: Twitter sharing optimization
- **Structured Data**: JSON-LD for search engines

### Search Engine Optimization
- **Sitemap**: Auto-generated `sitemap.xml`
- **Robots**: Proper `robots.txt` configuration
- **Meta Tags**: Complete SEO meta tags
- **Canonical URLs**: Prevent duplicate content
- **Mobile Responsive**: Optimized for all devices

## 🔧 Adding New Festivals

### Method 1: Admin Panel
1. Visit `/admin.html`
2. Login with password: `admin123`
3. Approve user-submitted events

### Method 2: Code Addition
1. Edit `script.js`
2. Add to `events` object:
   ```javascript
   "festival-name": { 
       name: "Festival Name", 
       date: "2025-MM-DD", 
       emoji: "🎉", 
       tagline: "Festival description ✨", 
       image: "https://example.com/image.jpg",
       description: "Detailed festival description"
   }
   ```

## 📱 Share Functionality

Users can share countdowns via:
- **Facebook**: Direct sharing with preview
- **Twitter**: Tweet with countdown info
- **WhatsApp**: Message with link
- **Copy Link**: Copy URL to clipboard

## 🎨 Customization

### Styling
- Edit `style.css` for visual changes
- Modify color schemes in CSS variables
- Update animations and transitions

### Content
- Update festival data in `script.js`
- Modify page templates in HTML files
- Add new festival images to `images/` folder

## 🔍 SEO Optimization Tips

1. **Keywords**: Include festival names in titles and descriptions
2. **Images**: Use high-quality, relevant festival images
3. **Content**: Add detailed festival descriptions
4. **Links**: Internal linking between related festivals
5. **Performance**: Optimize images and minimize CSS/JS

## 📊 Analytics Integration

Add Google Analytics or other tracking:

```html
<!-- Add to <head> section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🛠️ Development

### Local Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Manual Deployment
```bash
npm run deploy
```

## 📝 License

MIT License - feel free to use for your own projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact: [your-email@example.com]

---

**Made with ❤️ for festival lovers worldwide!**