// Main events data
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load approved events from localStorage and merge with main events
    loadApprovedEvents();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize popular events display
    initializePopularEvents();
}

function setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('festivalSearch');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // Add event modal
    const addEventBtn = document.getElementById('addEventBtn');
    const modal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.close');
    const eventForm = document.getElementById('eventForm');
    
    if (addEventBtn) {
        addEventBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmission);
    }
    
    // Close modal when clicking outside
    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

function handleSearch() {
    const searchInput = document.getElementById('festivalSearch');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        alert('Please enter a festival name to search!');
        return;
    }
    
    // Convert search query to slug
    const slug = query.replace(/\s+/g, '-');
    
    // Check if event exists
    if (events[slug]) {
        showEventCountdown(events[slug]);
    } else {
        // Try to find partial matches
        const matches = Object.keys(events).filter(key => 
            events[key].name.toLowerCase().includes(query) ||
            key.includes(query)
        );
        
        if (matches.length > 0) {
            // Show first match
            showEventCountdown(events[matches[0]]);
        } else {
            alert(`Festival "${query}" not found. Try searching for: Diwali, Christmas, New Year, or Gandhi Jayanti`);
        }
    }
}

function initializePopularEvents() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('click', function() {
            const eventSlug = this.dataset.event;
            if (eventSlug && events[eventSlug]) {
                showEventCountdown(events[eventSlug]);
            }
        });
    });
}

function showEventCountdown(event) {
    // Get event slug for URL routing
    const eventSlug = Object.keys(events).find(key => events[key] === event);
    
    if (eventSlug) {
        // Redirect to dedicated event page
        window.location.href = `/${eventSlug}`;
        return;
    }
    
    // Fallback to modal if no slug found
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content countdown-modal';
    
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <div class="countdown-header">
            <h2>${event.emoji} ${event.name}</h2>
            <p class="event-tagline">${event.tagline}</p>
        </div>
        <div class="countdown-display">
            <div class="countdown">
                <div class="time-unit">
                    <span class="time-value" id="modal-days">0</span>
                    <span class="time-label">Days</span>
                </div>
                <div class="time-unit">
                    <span class="time-value" id="modal-hours">0</span>
                    <span class="time-label">Hours</span>
                </div>
                <div class="time-unit">
                    <span class="time-value" id="modal-minutes">0</span>
                    <span class="time-label">Minutes</span>
                </div>
                <div class="time-unit">
                    <span class="time-value" id="modal-seconds">0</span>
                    <span class="time-label">Seconds</span>
                </div>
            </div>
            <div class="celebration hidden" id="modal-celebration">
                <h3>🎉 It's Time to Celebrate! 🎉</h3>
                <p>${event.tagline}</p>
            </div>
        </div>
        <div class="event-details">
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</p>
            <div class="share-container">
                <button onclick="shareEvent('${eventSlug || 'event'}')" class="share-btn">📤 Share This Countdown</button>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Start countdown
    startModalCountdown(event, modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function startModalCountdown(event, modal) {
    const eventDate = new Date(event.date).getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        if (distance < 0) {
            // Event has passed
            modal.querySelector('.countdown').classList.add('hidden');
            modal.querySelector('#modal-celebration').classList.remove('hidden');
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update countdown values with animation
        updateCountdownValue(modal.querySelector('#modal-days'), days);
        updateCountdownValue(modal.querySelector('#modal-hours'), hours);
        updateCountdownValue(modal.querySelector('#modal-minutes'), minutes);
        updateCountdownValue(modal.querySelector('#modal-seconds'), seconds);
    }
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    // Store interval ID for cleanup when modal is closed
    modal.dataset.intervalId = interval;
    
    // Cleanup interval when modal is removed
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.removedNodes.forEach((node) => {
                    if (node === modal) {
                        clearInterval(interval);
                        observer.disconnect();
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true });
}

function updateCountdownValue(element, newValue) {
    const currentValue = parseInt(element.textContent);
    if (currentValue !== newValue) {
        element.textContent = newValue;
        // Trigger animation
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'countdownPulse 1s ease-in-out';
    }
}

function handleEventSubmission(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('eventName').value.trim(),
        date: document.getElementById('eventDate').value,
        emoji: document.getElementById('eventEmoji').value.trim() || '🎉',
        tagline: document.getElementById('eventTagline').value.trim(),
        image: document.getElementById('eventImage').value.trim(),
        submittedAt: new Date().toISOString()
    };
    
    // Validate form data
    if (!formData.name || !formData.date) {
        alert('Please fill in the required fields (Name and Date)');
        return;
    }
    
    // Validate date is in the future
    const eventDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate <= today) {
        alert('Please select a future date for the event');
        return;
    }
    
    // Save to pending events
    savePendingEvent(formData);
    
    // Show success message
    showSuccessMessage();
    
    // Reset form and close modal
    document.getElementById('eventForm').reset();
    document.getElementById('eventModal').style.display = 'none';
}

function savePendingEvent(eventData) {
    const pendingEvents = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
    pendingEvents.push(eventData);
    localStorage.setItem('pendingEvents', JSON.stringify(pendingEvents));
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
}

function loadApprovedEvents() {
    const approvedEvents = JSON.parse(localStorage.getItem('approvedEvents') || '[]');
    
    // Merge approved events with main events
    approvedEvents.forEach(event => {
        const slug = event.name.toLowerCase().replace(/\s+/g, '-');
        events[slug] = {
            name: event.name,
            date: event.date,
            emoji: event.emoji,
            tagline: event.tagline,
            image: event.image
        };
    });
    
    // Save merged events to localStorage for event pages
    localStorage.setItem('mainEvents', JSON.stringify(events));
    
    // Update the popular events display to include user-created events
    updatePopularEventsDisplay();
}

function updatePopularEventsDisplay() {
    const eventGrid = document.querySelector('.event-grid');
    if (!eventGrid) return;
    
    // Clear existing cards except the main ones
    const mainEventCards = eventGrid.querySelectorAll('.event-card[data-event]');
    const approvedEvents = JSON.parse(localStorage.getItem('approvedEvents') || '[]');
    
    // Remove any existing user-created event cards
    const userEventCards = eventGrid.querySelectorAll('.event-card.user-created');
    userEventCards.forEach(card => card.remove());
    
    // Add user-created event cards
    approvedEvents.forEach(event => {
        const slug = event.name.toLowerCase().replace(/\s+/g, '-');
        const card = document.createElement('div');
        card.className = 'event-card user-created';
        card.dataset.event = slug;
        
        card.innerHTML = `
            <span class="event-emoji">${event.emoji}</span>
            <span class="event-name">${event.name}</span>
        `;
        
        // Add click handler
        card.addEventListener('click', function() {
            showEventCountdown(events[slug]);
        });
        
        eventGrid.appendChild(card);
    });
}

// Utility function to create slug from text
function createSlug(text) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
}

// Share functionality
function shareEvent(eventSlug) {
    const event = events[eventSlug];
    if (!event) return;
    
    const url = `${window.location.origin}/${eventSlug}`;
    const text = `Check out this ${event.name} countdown! ${event.tagline}`;
    
    // Create share options modal
    const shareModal = document.createElement('div');
    shareModal.className = 'modal';
    shareModal.style.display = 'block';
    
    const shareContent = document.createElement('div');
    shareContent.className = 'modal-content';
    shareContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>Share ${event.name} Countdown</h2>
        <div class="share-options">
            <button onclick="shareToFacebook('${url}', '${text}')" class="share-option facebook">📘 Facebook</button>
            <button onclick="shareToTwitter('${url}', '${text}')" class="share-option twitter">🐦 Twitter</button>
            <button onclick="shareToWhatsApp('${url}', '${text}')" class="share-option whatsapp">💬 WhatsApp</button>
            <button onclick="copyLink('${url}')" class="share-option copy">📋 Copy Link</button>
        </div>
    `;
    
    shareModal.appendChild(shareContent);
    document.body.appendChild(shareModal);
    
    // Close modal functionality
    const closeBtn = shareModal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(shareModal);
    });
    
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            document.body.removeChild(shareModal);
        }
    });
}

function shareToFacebook(url, text) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
}

function shareToTwitter(url, text) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank');
}

function shareToWhatsApp(url, text) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText} ${encodedUrl}`, '_blank');
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(function() {
        alert('Link copied to clipboard!');
    }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
    });
}

// Export events and functions for use in other pages
window.events = events;
window.shareEvent = shareEvent;
window.shareToFacebook = shareToFacebook;
window.shareToTwitter = shareToTwitter;
window.shareToWhatsApp = shareToWhatsApp;
window.copyLink = copyLink;
