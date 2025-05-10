const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json
let scripts = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  scripts = JSON.parse(data); // Example: { "abc123": "print('luau!')" }
} catch (e) {
  console.error('Failed to load index.json:', e);
}

// Utility: check if request is from a browser
function isBrowser(req) {
  const accept = req.headers.accept || '';
  const ua = req.headers['user-agent'] || '';
  return accept.includes('text/html') || /mozilla|chrome|safari|edge|firefox/i.test(ua);
}

app.use(express.static(__dirname));

// Handle script request
app.get('/script/api/:scriptName', (req, res) => {
  const id = req.params.scriptName?.toLowerCase();
  const script = scripts[id];

  if (script) {
    if (isBrowser(req)) {
      // If it's a browser and script is valid, show index.html
      return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      // If it's not a browser, return raw Lua script
      res.type('text/plain');
      return res.send(script);
    }
  } else {
    // Not found in index.json
    return res.sendFile(path.join(__dirname, 'index2.html'));
  }
});

// If path is /script/api (without ID), show index2.html
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Home page
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// All other unknown paths
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
