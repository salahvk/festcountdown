const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// API Routes
const EVENTS_FILE = path.join(__dirname, 'events.json');

// Initialize events file if it doesn't exist
if (!fs.existsSync(EVENTS_FILE)) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify({
    approved: [],
    pending: []
  }));
}

// GET /api/events - Get all events
app.get('/api/events', (req, res) => {
  try {
    const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
    res.json(eventsData);
  } catch (error) {
    console.error('Error reading events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/events - Submit new event
app.post('/api/events', (req, res) => {
  try {
    const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
    
    const newEvent = {
      ...req.body,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    eventsData.pending.push(newEvent);
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
    
    res.status(201).json({ message: 'Event submitted successfully', event: newEvent });
  } catch (error) {
    console.error('Error submitting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/events - Approve/reject/remove event
app.put('/api/events', (req, res) => {
  try {
    const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
    const { id, action } = req.body;
    
    if (action === 'approve') {
      const pendingIndex = eventsData.pending.findIndex(e => e.id === id);
      if (pendingIndex === -1) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      const event = eventsData.pending[pendingIndex];
      event.status = 'approved';
      event.approvedAt = new Date().toISOString();
      
      eventsData.approved.push(event);
      eventsData.pending.splice(pendingIndex, 1);
      
      fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
      res.json({ message: 'Event approved successfully' });
    } else if (action === 'reject') {
      const pendingIndex = eventsData.pending.findIndex(e => e.id === id);
      if (pendingIndex === -1) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      eventsData.pending.splice(pendingIndex, 1);
      fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
      res.json({ message: 'Event rejected' });
    } else if (action === 'remove') {
      const approvedIndex = eventsData.approved.findIndex(e => e.id === id);
      if (approvedIndex === -1) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      eventsData.approved.splice(approvedIndex, 1);
      fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
      res.json({ message: 'Event removed successfully' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/event/:slug - Get specific event by slug
app.get('/api/event/:slug', (req, res) => {
  try {
    const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
    const { slug } = req.params;
    
    // Find event by slug in approved events
    const event = eventsData.approved.find(e => {
      const eventSlug = e.name.toLowerCase().replace(/\s+/g, '-');
      return eventSlug === slug;
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle dynamic festival routes
app.get('/:slug', (req, res) => {
  const { slug } = req.params;
  
  // Skip API routes and static files
  if (slug.startsWith('api') || slug.includes('.')) {
    return res.status(404).send('Not found');
  }
  
  // Serve the dynamic event template
  res.sendFile(path.join(__dirname, 'event.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 Festival Countdown Server running at http://localhost:${PORT}`);
  console.log(`📱 Available URLs:`);
  console.log(`   • Main site: http://localhost:${PORT}/`);
  console.log(`   • Admin: http://localhost:${PORT}/admin.html`);
  console.log(`   • API: http://localhost:${PORT}/api/events`);
  console.log(`\n🚀 Press Ctrl+C to stop the server`);
});
