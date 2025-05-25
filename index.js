const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load the script database
const scripts = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8'));

// Helper to detect browser or logging agents
function isUserAgentBlacklisted(req) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const accept = req.headers.accept || '';
  return (
    accept.includes('text/html') ||
    ua.includes('mozilla') ||
    ua.includes('chrome') ||
    ua.includes('safari') ||
    ua.includes('firefox') ||
    ua.includes('edge') ||
    ua.includes('windows') ||
    ua.includes('curl') ||
    ua.includes('wget')
  );
}

// Serve static files (index.html, etc.)
app.use(express.static(__dirname));

// Main route for Luau script API
app.get('/script/api/:scriptName', (req, res) => {
  const name = req.params.scriptName.toLowerCase();

  // If browser/logger/etc → show index.html
  if (isUserAgentBlacklisted(req)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // If script found in DB → return as Luau
  if (scripts[name]) {
    res.type('text/plain');
    return res.send(scripts[name]);
  }

  // Unknown script → also index.html
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// All other routes → show index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
