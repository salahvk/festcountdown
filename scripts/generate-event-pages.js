const fs = require('fs');
const path = require('path');

// Main events data (same as in script.js)
const events = {
    diwali: { 
        name: "Diwali", 
        date: "2025-10-20", 
        emoji: "🪔", 
        tagline: "Festival of Lights begins soon ✨", 
        image: "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=🪔+Diwali+Festival",
        description: "Diwali, the Festival of Lights, is one of the most important Hindu festivals celebrated across India and the world. It symbolizes the victory of light over darkness and good over evil."
    },
    "gandhi-jayanti": { 
        name: "Gandhi Jayanti", 
        date: "2025-10-02", 
        emoji: "🕊", 
        tagline: "Honoring the Mahatma 🙏", 
        image: "https://via.placeholder.com/400x300/FFD700/ffffff?text=🕊+Gandhi+Jayanti",
        description: "Gandhi Jayanti commemorates the birth anniversary of Mahatma Gandhi, the Father of the Nation, who led India to independence through non-violent resistance."
    },
    christmas: { 
        name: "Christmas", 
        date: "2025-12-25", 
        emoji: "🎄", 
        tagline: "Merry Christmas in advance 🎅", 
        image: "https://via.placeholder.com/400x300/228B22/ffffff?text=🎄+Christmas+Festival",
        description: "Christmas is a Christian holiday celebrating the birth of Jesus Christ, observed by billions of people worldwide with joy, gifts, and festive celebrations."
    },
    "new-year": { 
        name: "New Year 2026", 
        date: "2026-01-01", 
        emoji: "🎆", 
        tagline: "A new beginning awaits 🌟", 
        image: "https://via.placeholder.com/400x300/4B0082/ffffff?text=🎆+New+Year+Festival",
        description: "New Year's Day marks the beginning of a new calendar year, celebrated worldwide with fireworks, parties, and resolutions for the year ahead."
    }
};

// Load approved events from localStorage simulation
function loadApprovedEvents() {
    try {
        const approvedEvents = JSON.parse(fs.readFileSync('approved-events.json', 'utf8') || '[]');
        approvedEvents.forEach(event => {
            const slug = event.name.toLowerCase().replace(/\s+/g, '-');
            events[slug] = {
                name: event.name,
                date: event.date,
                emoji: event.emoji,
                tagline: event.tagline,
                image: event.image,
                description: event.description || event.tagline
            };
        });
    } catch (error) {
        console.log('No approved events file found, using default events');
    }
}

// Generate SEO-optimized HTML for each event
function generateEventPage(eventSlug, event) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>${event.name} Countdown 2025 - ${event.tagline}</title>
    <meta name="description" content="${event.description} Countdown timer showing exactly how many days, hours, minutes, and seconds until ${event.name} ${eventDate.getFullYear()}. ${event.tagline}">
    <meta name="keywords" content="${event.name.toLowerCase()}, ${event.name.toLowerCase()} countdown, ${event.name.toLowerCase()} 2025, festival countdown, ${event.name.toLowerCase()} timer, ${event.name.toLowerCase()} date">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${event.name} Countdown 2025 - ${event.tagline}">
    <meta property="og:description" content="${event.description} Countdown timer showing exactly how many days, hours, minutes, and seconds until ${event.name} ${eventDate.getFullYear()}.">
    <meta property="og:image" content="${event.image}">
    <meta property="og:url" content="https://festcountdown.com/${eventSlug}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Festival Countdown">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${event.name} Countdown 2025">
    <meta name="twitter:description" content="${event.description} Countdown timer showing exactly how many days, hours, minutes, and seconds until ${event.name} ${eventDate.getFullYear()}.">
    <meta name="twitter:image" content="${event.image}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://festcountdown.com/${eventSlug}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "${event.name}",
        "description": "${event.description}",
        "startDate": "${event.date}",
        "image": "${event.image}",
        "url": "https://festcountdown.com/${eventSlug}",
        "organizer": {
            "@type": "Organization",
            "name": "Festival Countdown"
        }
    }
    </script>
    
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
    <div class="container">
        <header class="event-header">
            <a href="/" class="back-btn">← Back to Home</a>
            <h1 id="eventTitle" class="event-title">${event.emoji} ${event.name}</h1>
            <p id="eventTagline" class="event-tagline">${event.tagline}</p>
            
            <!-- Share Button -->
            <div class="share-container">
                <button id="shareBtn" class="share-btn">📤 Share This Countdown</button>
                <div id="shareOptions" class="share-options hidden">
                    <button onclick="shareToFacebook()" class="share-option facebook">Facebook</button>
                    <button onclick="shareToTwitter()" class="share-option twitter">Twitter</button>
                    <button onclick="shareToWhatsApp()" class="share-option whatsapp">WhatsApp</button>
                    <button onclick="copyLink()" class="share-option copy">Copy Link</button>
                </div>
            </div>
        </header>

        <main class="countdown-main">
            <div class="event-image-container">
                <img id="eventImage" src="${event.image}" alt="${event.name} Festival" class="event-image">
            </div>

            <div class="countdown-container">
                <div id="countdown" class="countdown">
                    <div class="time-unit">
                        <span id="days" class="time-value">0</span>
                        <span class="time-label">Days</span>
                    </div>
                    <div class="time-unit">
                        <span id="hours" class="time-value">0</span>
                        <span class="time-label">Hours</span>
                    </div>
                    <div class="time-unit">
                        <span id="minutes" class="time-value">0</span>
                        <span class="time-label">Minutes</span>
                    </div>
                    <div class="time-unit">
                        <span id="seconds" class="time-value">0</span>
                        <span class="time-label">Seconds</span>
                    </div>
                </div>

                <div id="celebration" class="celebration hidden">
                    <h2>🎉 It's Time to Celebrate! 🎉</h2>
                    <p id="celebrationMessage">${event.tagline}</p>
                </div>
            </div>

            <div class="event-info">
                <div class="info-card">
                    <h3>Event Details</h3>
                    <p><strong>Date:</strong> <span id="eventDate">${formattedDate}</span></p>
                    <p><strong>Status:</strong> <span id="eventStatus">⏰ Countdown Active</span></p>
                    <p><strong>Description:</strong> ${event.description}</p>
                </div>
            </div>
        </main>
    </div>

    <script src="script.js"></script>
    <script>
        // Event-specific script
        document.addEventListener('DOMContentLoaded', function() {
            const eventData = ${JSON.stringify(event)};
            displayEvent(eventData);
            startCountdown(eventData);
            setupShareFunctionality();
        });

        function displayEvent(event) {
            document.getElementById('eventTitle').textContent = event.emoji + ' ' + event.name;
            document.getElementById('eventTagline').textContent = event.tagline;
            
            if (event.image) {
                document.getElementById('eventImage').src = event.image;
                document.getElementById('eventImage').style.display = 'block';
            }
        }

        function startCountdown(event) {
            const eventDate = new Date(event.date).getTime();
            
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = eventDate - now;
                
                if (distance < 0) {
                    // Event has passed
                    document.getElementById('countdown').classList.add('hidden');
                    document.getElementById('celebration').classList.remove('hidden');
                    document.getElementById('celebrationMessage').textContent = event.tagline;
                    document.getElementById('eventStatus').textContent = '🎉 Celebrating Now!';
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('days').textContent = days;
                document.getElementById('hours').textContent = hours;
                document.getElementById('minutes').textContent = minutes;
                document.getElementById('seconds').textContent = seconds;
                
                document.getElementById('eventStatus').textContent = '⏰ Countdown Active';
            }
            
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }

        function setupShareFunctionality() {
            const shareBtn = document.getElementById('shareBtn');
            const shareOptions = document.getElementById('shareOptions');
            
            shareBtn.addEventListener('click', function() {
                shareOptions.classList.toggle('hidden');
            });
            
            // Close share options when clicking outside
            document.addEventListener('click', function(e) {
                if (!shareBtn.contains(e.target) && !shareOptions.contains(e.target)) {
                    shareOptions.classList.add('hidden');
                }
            });
        }

        function shareToFacebook() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(\`Check out this ${event.name} countdown!\`);
            window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${url}&quote=\${text}\`, '_blank');
        }

        function shareToTwitter() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(\`Check out this ${event.name} countdown! ${event.tagline}\`);
            window.open(\`https://twitter.com/intent/tweet?url=\${url}&text=\${text}\`, '_blank');
        }

        function shareToWhatsApp() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(\`Check out this ${event.name} countdown! ${event.tagline}\`);
            window.open(\`https://wa.me/?text=\${text} \${url}\`, '_blank');
        }

        function copyLink() {
            navigator.clipboard.writeText(window.location.href).then(function() {
                alert('Link copied to clipboard!');
            });
        }
    </script>
</body>
</html>`;

    return html;
}

// Generate sitemap.xml
function generateSitemap() {
    const baseUrl = 'https://festcountdown.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    Object.keys(events).forEach(slug => {
        sitemap += `
    <url>
        <loc>${baseUrl}/${slug}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
}

// Generate robots.txt
function generateRobotsTxt() {
    return `User-agent: *
Allow: /

Sitemap: https://festcountdown.com/sitemap.xml`;
}

// Main execution
function main() {
    console.log('Generating event pages...');
    
    // Load approved events
    loadApprovedEvents();
    
    // Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
    
    // Generate individual event pages
    Object.keys(events).forEach(slug => {
        const event = events[slug];
        const html = generateEventPage(slug, event);
        fs.writeFileSync(path.join('dist', `${slug}.html`), html);
        console.log(`Generated: ${slug}.html`);
    });
    
    // Generate sitemap.xml
    const sitemap = generateSitemap();
    fs.writeFileSync(path.join('dist', 'sitemap.xml'), sitemap);
    console.log('Generated: sitemap.xml');
    
    // Generate robots.txt
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(path.join('dist', 'robots.txt'), robotsTxt);
    console.log('Generated: robots.txt');
    
    console.log('All event pages generated successfully!');
}

if (require.main === module) {
    main();
}

module.exports = { generateEventPage, generateSitemap, generateRobotsTxt };
