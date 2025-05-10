const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load scripts from index.json
let scripts = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  scripts = JSON.parse(data);
} catch (err) {
  console.error("Failed to load index.json:", err);
}

// Detect if the request is from a browser
function isBrowser(req) {
  const accept = req.headers.accept || '';
  const ua = req.headers['user-agent'] || '';
  return accept.includes('text/html') || /mozilla|chrome|safari|edge|firefox/i.test(ua);
}

app.use(express.static(__dirname));

// Route: /script/api/:scriptName
app.get('/script/api/:scriptName', (req, res) => {
  const id = req.params.scriptName?.toLowerCase();
  const script = scripts[id];

  if (script) {
    if (isBrowser(req)) {
      return res.sendFile(path.join(__dirname, 'index1.html')); // Show index1.html for browsers
    } else {
      res.type('text/plain');
      return res.send(script); // Return raw script for Lua
    }
  } else {
    return res.sendFile(path.join(__dirname, 'index2.html')); // Not found, show index2.html
  }
});

// Route: /script/api (no script name)
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Route: /
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for all other routes
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
