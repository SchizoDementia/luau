const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json (your script database)
let scripts = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  scripts = JSON.parse(data); // { "abc123": "print('luau!')", ... }
} catch (e) {
  console.error('Error reading index.json:', e);
}

// Detect if request comes from a browser
function isBrowser(req) {
  const accept = req.headers.accept || '';
  const ua = req.headers['user-agent'] || '';
  return accept.includes('text/html') || /mozilla|chrome|safari|edge|firefox/i.test(ua);
}

// Serve static assets
app.use(express.static(__dirname));

// Script endpoint
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();
  const script = scripts[scriptName];

  if (script) {
    if (isBrowser(req)) {
      return res.sendFile(path.join(__dirname, 'index.html')); // Browser gets UI
    } else {
      res.type('text/plain');
      return res.send(script); // Script client gets raw code
    }
  }

  // Not found in index.json
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Handle exact /script/api (no ID provided)
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Root homepage
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// All other random routes
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
