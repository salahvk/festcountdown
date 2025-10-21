// Main events data
const events = {
    diwali: { 
        name: "Diwali", 
        date: "2025-10-20", 
        emoji: "🪔", 
        tagline: "Festival of Lights begins soon ✨", 
        image: "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=🪔+Diwali+Festival" 
    },
    "gandhi-jayanti": { 
        name: "Gandhi Jayanti", 
        date: "2025-10-02", 
        emoji: "🕊", 
        tagline: "Honoring the Mahatma 🙏", 
        image: "https://via.placeholder.com/400x300/FFD700/ffffff?text=🕊+Gandhi+Jayanti" 
    },
    christmas: { 
        name: "Christmas", 
        date: "2025-12-25", 
        emoji: "🎄", 
        tagline: "Merry Christmas in advance 🎅", 
        image: "https://via.placeholder.com/400x300/228B22/ffffff?text=🎄+Christmas+Festival" 
    },
    "new-year": { 
        name: "New Year 2026", 
        date: "2026-01-01", 
        emoji: "🎆", 
        tagline: "A new beginning awaits 🌟", 
        image: "https://via.placeholder.com/400x300/4B0082/ffffff?text=🎆+New+Year+Festival" 
    }
};

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
