// API endpoint for managing events
// Using in-memory storage for Vercel serverless functions

// In-memory storage (will reset on each deployment)
let eventsData = {
  approved: [
    {
      "id": "1",
      "name": "Salah Birthday",
      "date": "2025-12-15",
      "emoji": "🎉",
      "tagline": "Celebrating another year of joy! 🎂",
      "image": "https://via.placeholder.com/400x300/FF69B4/ffffff?text=🎉+Birthday+Celebration",
      "description": "A special birthday celebration filled with joy, laughter, and wonderful memories.",
      "status": "approved",
      "submittedAt": "2024-12-20T10:00:00.000Z",
      "approvedAt": "2024-12-20T10:05:00.000Z"
    }
  ],
  pending: []
};

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
          
          res.status(200).json({ message: 'Event approved successfully' });
        } else if (action === 'reject') {
          const pendingIndex = eventsData.pending.findIndex(e => e.id === id);
          if (pendingIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
          }
          
          eventsData.pending.splice(pendingIndex, 1);
          res.status(200).json({ message: 'Event rejected' });
        } else if (action === 'remove') {
          const approvedIndex = eventsData.approved.findIndex(e => e.id === id);
          if (approvedIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
          }
          
          eventsData.approved.splice(approvedIndex, 1);
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
