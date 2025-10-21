// api/festival/[slug].js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { slug } = req.query;
  
  // List of known festival pages that have dedicated HTML files
  const knownFestivals = [
    'diwali', 'christmas', 'new-year', 'gandhi-jayanti', 
    'eid', 'onam', 'ramzan', 'apj-birthday', 'apj-death-day', 
    'salah-new-birthday'
  ];
  
  // Check if it's a known festival page
  if (knownFestivals.includes(slug)) {
    // Redirect to the dedicated HTML file
    res.redirect(302, `/${slug}.html`);
  } else {
    // For unknown festivals, serve the dynamic event template
    // This allows users to create custom festival pages
    res.redirect(302, `/event.html?festival=${encodeURIComponent(slug)}`);
  }
}