const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Paths
const indexJsonPath = path.join(__dirname, 'index.json');
const indexHtmlPath = path.join(__dirname, 'index.html');

// Load index.json once at startup
let indexJson = {};
try {
  indexJson = JSON.parse(fs.readFileSync(indexJsonPath, 'utf-8'));
} catch (err) {
  console.error('Failed to load index.json:', err.message);
}

// Helper: detect browser/user-agent
function isUserAgent(req) {
  const ua = req.headers['user-agent'] || '';
  const accept = req.headers.accept || '';
  return ua.includes('Mozilla') || accept.includes('text/html');
}

// Static assets (optional)
app.use(express.static(__dirname));

// Main Script API
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();
  const scriptEntry = indexJson[scriptName];

  if (isUserAgent(req)) {
    // Browsers always see index.html
    return res.sendFile(indexHtmlPath);
  }

  if (scriptEntry && scriptEntry.script) {
    res.type('text/plain');
    return res.send(scriptEntry.script);
  }

  return res.status(404).send('-- Script not found.');
});

// Root for browser
app.get('/', (req, res) => {
  return res.sendFile(indexHtmlPath);
});

// Catch-all fallback
app.get('*', (req, res) => {
  return res.sendFile(indexHtmlPath);
});

// Server start
app.listen(port, () => {
  console.log(`Luarmor-like gateway running on http://localhost:${port}`);
});
