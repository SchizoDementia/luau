const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Load script database
const scripts = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8'));

// Serve static files like index.html, CSS, JS
app.use(express.static(__dirname));

// Helper to detect browser user-agent or logger
function isBrowser(req) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const accept = req.headers.accept || '';
  return accept.includes('text/html') ||
         ua.includes('mozilla') || ua.includes('chrome') || ua.includes('safari') || ua.includes('firefox');
}

// Route for /script/api/:scriptName
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName.toLowerCase();

  if (isBrowser(req)) {
    // Always serve index.html for browsers or loggers
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // If script exists in DB, return raw Luau script
  if (scripts[scriptName]) {
    res.type('text/plain');
    return res.send(scripts[scriptName]);
  }

  // If script not found, just serve index.html (no fallback script)
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// All other routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
