// API endpoint for managing events
import fs from 'fs';
import path from 'path';

const EVENTS_FILE = path.join(process.cwd(), 'events.json');

// Initialize events file if it doesn't exist
if (!fs.existsSync(EVENTS_FILE)) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify({
    approved: [],
    pending: []
  }));
}

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));

    switch (req.method) {
      case 'GET':
        // Get all events
        res.status(200).json(eventsData);
        break;

      case 'POST':
        // Add new event (pending)
        const newEvent = {
          ...req.body,
          id: Date.now().toString(),
          submittedAt: new Date().toISOString(),
          status: 'pending'
        };
        
        eventsData.pending.push(newEvent);
        fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
        
        res.status(201).json({ message: 'Event submitted successfully', event: newEvent });
        break;

      case 'PUT':
        // Approve or update event
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
          res.status(200).json({ message: 'Event approved successfully' });
        } else if (action === 'reject') {
          const pendingIndex = eventsData.pending.findIndex(e => e.id === id);
          if (pendingIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
          }
          
          eventsData.pending.splice(pendingIndex, 1);
          fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
          res.status(200).json({ message: 'Event rejected' });
        } else if (action === 'remove') {
          const approvedIndex = eventsData.approved.findIndex(e => e.id === id);
          if (approvedIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
          }
          
          eventsData.approved.splice(approvedIndex, 1);
          fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
          res.status(200).json({ message: 'Event removed successfully' });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
