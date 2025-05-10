const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json
let scripts = {};
try {
  const file = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  scripts = JSON.parse(file);
} catch (e) {
  console.error('Error loading index.json:', e);
}

// Helper to detect browser
function isBrowser(req) {
  const accept = req.headers['accept'] || '';
  const ua = req.headers['user-agent'] || '';
  return accept.includes('text/html') || /mozilla|chrome|safari|edge|firefox/i.test(ua);
}

// Serve static files
app.use(express.static(__dirname));

// Handle script request
app.get('/script/api/:id', (req, res) => {
  const id = req.params.id?.toLowerCase();
  const script = scripts[id];

  if (script) {
    if (isBrowser(req)) {
      // Browser: show index.html
      return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      // Script clients: raw
      res.type('text/plain');
      return res.send(script);
    }
  } else {
    // Not found: show index1.html
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
});

// If someone visits "/script/api" with no param (like "/script/api/")
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html')); // treat as random
});

// Home page
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Everything else (fallback)
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start server
app.listen(port, () => {
  console.log(`MoonVeil server running on http://localhost:${port}`);
});
