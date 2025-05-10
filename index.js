const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load scripts from index.json
let scripts = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  scripts = JSON.parse(data); // { "abc123": "print(...)", ... }
} catch (e) {
  console.error('Failed to load index.json:', e);
}

// Strong browser detection using User-Agent
function isBrowser(req) {
  const ua = req.headers['user-agent'] || '';
  return /mozilla|chrome|safari|edge|firefox/i.test(ua); // Only browsers
}

// Serve static files (like index.html, index1.html, etc.)
app.use(express.static(__dirname));

// Route: /script/api/:scriptName
app.get('/script/api/:scriptName', (req, res) => {
  const id = req.params.scriptName?.toLowerCase();
  const script = scripts[id];

  if (script) {
    if (isBrowser(req)) {
      // Valid script, but browser: show index.html
      return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      // Valid script, but from client: return script
      res.type('text/plain');
      return res.send(script);
    }
  } else {
    // Invalid script (not found in index.json): show index2.html
    return res.sendFile(path.join(__dirname, 'index2.html'));
  }
});

// Route: /script/api with no scriptName
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html')); // Invalid request, show fallback
});

// Route: /
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html')); // Home page
});

// Catch-all route for everything else
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html')); // Unknown routes, show fallback
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
