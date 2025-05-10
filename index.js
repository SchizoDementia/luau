const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

// Load index.json once on startup
let scriptData = {};
try {
  scriptData = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json')));
} catch (err) {
  console.error('Failed to load index.json:', err);
}

// Helper: Is browser
function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// /api/script returns a hardcoded script
app.get('/api/script', (req, res) => {
  res.type('text/plain');
  return res.send(`print("Hi")`);
});

// /script/api/:scriptName routes
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  // Look in index.json
  const scriptOutput = scriptData[scriptName];
  if (scriptOutput) {
    res.type('text/plain');
    return res.send(scriptOutput);
  }

  // Fallback if script name not found
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// All other routes
app.get('*', (req, res) => {
  // Only fallback to index1.html if path starts with script/api
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  // Otherwise fallback to index2.html
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
