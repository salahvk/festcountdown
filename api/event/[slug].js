// API endpoint for getting specific event by slug
import fs from 'fs';
import path from 'path';

const EVENTS_FILE = path.join(process.cwd(), 'events.json');

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
    if (!fs.existsSync(EVENTS_FILE)) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
    
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
