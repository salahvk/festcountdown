// API endpoint for getting specific event by slug
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
  const { slug } = req.query;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Find event by slug in approved events
    const event = eventsData.approved.find(e => {
      const eventSlug = e.name.toLowerCase().replace(/\s+/g, '-');
      return eventSlug === slug;
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
