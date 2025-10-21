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
    },
    eid: {
        name: "Eid al-Fitr",
        date: "2025-03-30",
        emoji: "🌙",
        tagline: "Celebrating the end of Ramadan 🌟",
        image: "https://via.placeholder.com/400x300/228B22/ffffff?text=🌙+Eid+al-Fitr",
        description: "Eid al-Fitr is a Muslim holiday that marks the end of Ramadan, the Islamic holy month of fasting. It's a time of joy, gratitude, and celebration with family and friends."
    },
    onam: {
        name: "Onam",
        date: "2025-09-12",
        emoji: "🎭",
        tagline: "Kerala's harvest festival 🍃",
        image: "https://via.placeholder.com/400x300/FFD700/ffffff?text=🎭+Onam+Festival",
        description: "Onam is a major annual festival celebrated in Kerala, India. It commemorates the homecoming of the legendary King Mahabali and marks the harvest season."
    },
    ramzan: {
        name: "Ramadan",
        date: "2025-02-28",
        emoji: "☪️",
        tagline: "Holy month of fasting begins 🌙",
        image: "https://via.placeholder.com/400x300/4B0082/ffffff?text=☪️+Ramadan",
        description: "Ramadan is the ninth month of the Islamic calendar, observed by Muslims worldwide as a month of fasting, prayer, reflection, and community."
    },
    "apj-birthday": {
        name: "APJ Abdul Kalam Birthday",
        date: "2025-10-15",
        emoji: "🚀",
        tagline: "Remembering the People's President 🎓",
        image: "https://via.placeholder.com/400x300/FF6B6B/ffffff?text=🚀+APJ+Kalam+Birthday",
        description: "Dr. APJ Abdul Kalam, known as the 'People's President' and 'Missile Man of India', was born on this day. A scientist, teacher, and former President of India."
    },
    "apj-death-day": {
        name: "APJ Abdul Kalam Death Anniversary",
        date: "2025-07-27",
        emoji: "🕊️",
        tagline: "Honoring the Missile Man's legacy 🚀",
        image: "https://via.placeholder.com/400x300/4B0082/ffffff?text=🕊️+APJ+Kalam+Memorial",
        description: "Remembering Dr. APJ Abdul Kalam on his death anniversary. A visionary leader who inspired millions with his dedication to science, education, and nation-building."
    }
};

// Function to get the correct date for an event (current year or next year if passed)
function getEventDate(event) {
    const currentYear = new Date().getFullYear();
    const eventDate = new Date(event.date);
    const currentDate = new Date();
    
    // If the event date has passed this year, use next year's date
    if (eventDate < currentDate) {
        const nextYearDate = new Date(event.date);
        nextYearDate.setFullYear(currentYear + 1);
        return nextYearDate.toISOString().split('T')[0];
    }
    
    return event.date;
}

// Function to get event with correct date
function getEventWithCorrectDate(eventSlug) {
    const event = events[eventSlug];
    if (!event) return null;
    
    return {
        ...event,
        date: getEventDate(event)
    };
}

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
    const eventWithCorrectDate = getEventWithCorrectDate(eventSlug);
    const eventDate = new Date(eventWithCorrectDate.date);
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
    <meta name="description" content="${eventWithCorrectDate.description} Countdown timer showing exactly how many days, hours, minutes, and seconds until ${eventWithCorrectDate.name} ${eventDate.getFullYear()}. ${eventWithCorrectDate.tagline}">
    <meta name="keywords" content="${eventWithCorrectDate.name.toLowerCase()}, ${eventWithCorrectDate.name.toLowerCase()} countdown, ${eventWithCorrectDate.name.toLowerCase()} ${eventDate.getFullYear()}, festival countdown, ${eventWithCorrectDate.name.toLowerCase()} timer, ${eventWithCorrectDate.name.toLowerCase()} date">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${eventWithCorrectDate.name} Countdown ${eventDate.getFullYear()} - ${eventWithCorrectDate.tagline}">
    <meta property="og:description" content="${eventWithCorrectDate.description} Countdown timer showing exactly how many days, hours, minutes, and seconds until ${eventWithCorrectDate.name} ${eventDate.getFullYear()}.">
    <meta property="og:image" content="${eventWithCorrectDate.image}">
    <meta property="og:url" content="https://festcountdown.com/${eventSlug}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Festival Countdown">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${eventWithCorrectDate.name} Countdown ${eventDate.getFullYear()}">
    <meta name="twitter:description" content="${eventWithCorrectDate.description} Countdown timer showing exactly how many days, hours, minutes, and seconds until ${eventWithCorrectDate.name} ${eventDate.getFullYear()}.">
    <meta name="twitter:image" content="${eventWithCorrectDate.image}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://festcountdown.com/${eventSlug}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "${eventWithCorrectDate.name}",
        "description": "${eventWithCorrectDate.description}",
        "startDate": "${eventWithCorrectDate.date}",
        "image": "${eventWithCorrectDate.image}",
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
            <h1 id="eventTitle" class="event-title">${eventWithCorrectDate.emoji} ${eventWithCorrectDate.name}</h1>
            <p id="eventTagline" class="event-tagline">${eventWithCorrectDate.tagline}</p>
        </header>

        <main class="countdown-main-new">
            <div class="countdown-container-large">
                <div id="countdown" class="countdown-large">
                    <div class="time-unit-large">
                        <span id="days" class="time-value-large">0</span>
                        <span class="time-label-large">Days</span>
                    </div>
                    <div class="time-unit-large">
                        <span id="hours" class="time-value-large">0</span>
                        <span class="time-label-large">Hours</span>
                    </div>
                    <div class="time-unit-large">
                        <span id="minutes" class="time-value-large">0</span>
                        <span class="time-label-large">Minutes</span>
                    </div>
                    <div class="time-unit-large">
                        <span id="seconds" class="time-value-large">0</span>
                        <span class="time-label-large">Seconds</span>
                    </div>
                </div>

                <div id="celebration" class="celebration-large hidden">
                    <h2>🎉 It's Time to Celebrate! 🎉</h2>
                    <p id="celebrationMessage">${eventWithCorrectDate.tagline}</p>
                </div>
                
                <!-- Share Button below countdown -->
                <div class="share-container-below">
                    <button id="shareBtn" class="share-btn">📤 Share This Countdown</button>
                    <div id="shareOptions" class="share-options hidden">
                        <button onclick="shareToFacebook()" class="share-option facebook">Facebook</button>
                        <button onclick="shareToTwitter()" class="share-option twitter">Twitter</button>
                        <button onclick="shareToWhatsApp()" class="share-option whatsapp">WhatsApp</button>
                        <button onclick="copyLink()" class="share-option copy">Copy Link</button>
                    </div>
                </div>
            </div>
        </main>
        
        <!-- Back button at bottom left -->
        <div class="back-btn-bottom">
            <a href="/" class="back-btn">← Back to Home</a>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        // Event-specific script
        document.addEventListener('DOMContentLoaded', function() {
            const eventData = ${JSON.stringify(eventWithCorrectDate)};
            displayEvent(eventData);
            startCountdown(eventData);
            setupShareFunctionality();
        });

        function displayEvent(event) {
            document.getElementById('eventTitle').textContent = event.emoji + ' ' + event.name;
            document.getElementById('eventTagline').textContent = event.tagline;
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
            const text = encodeURIComponent(\`Check out this ${eventWithCorrectDate.name} countdown!\`);
            window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${url}&quote=\${text}\`, '_blank');
        }

        function shareToTwitter() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(\`Check out this ${eventWithCorrectDate.name} countdown! ${eventWithCorrectDate.tagline}\`);
            window.open(\`https://twitter.com/intent/tweet?url=\${url}&text=\${text}\`, '_blank');
        }

        function shareToWhatsApp() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(\`Check out this ${eventWithCorrectDate.name} countdown! ${eventWithCorrectDate.tagline}\`);
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
