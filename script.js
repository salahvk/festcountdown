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
        window.location.href = `/${slug}`;
    } else {
        // Try to find partial matches
        const matches = Object.keys(events).filter(key => 
            events[key].name.toLowerCase().includes(query) ||
            key.includes(query)
        );
        
        if (matches.length > 0) {
            // Redirect to first match
            window.location.href = `/${matches[0]}`;
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
                window.location.href = `/${eventSlug}`;
            }
        });
    });
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
}

// Utility function to create slug from text
function createSlug(text) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
}

// Export events for use in other pages
window.events = events;
