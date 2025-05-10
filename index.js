const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Serve all static files (optional for CSS, JS, etc.)
app.use(express.static(__dirname));

// Helper: Detect if request is from a browser
function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// Load script content from index.json
let scriptData = {};
try {
  const jsonPath = path.join(__dirname, 'index.json');
  scriptData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (err) {
  console.error('Failed to load index.json:', err);
}

// Route: Basic test script
app.get('/api/script', (req, res) => {
  res.type('text/plain');
  return res.send(`print("Hi")`);
});

// Route: Script API - serves scripts or index.html depending on client
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  if (isBrowser(req)) {
    // If browser visits script path, show main UI page
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  const scriptOutput = scriptData[scriptName];
  if (scriptOutput) {
    res.type('text/plain');
    return res.send(scriptOutput);
  }

  // Fallback if script not found
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Root route: Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback route: Any other path
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
