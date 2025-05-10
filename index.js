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

// Serve static assets
app.use(express.static(__dirname));

// API route: /script/api/:scriptName
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName.toLowerCase();
  const script = scripts[scriptName];

  if (script) {
    if (isBrowser(req)) {
      return res.sendFile(path.join(__dirname, 'index1.html')); // valid script -> index1.html
    } else {
      res.type('text/plain');
      return res.send(script); // Lua/client -> raw script
    }
  } else {
    return res.sendFile(path.join(__dirname, 'index2.html')); // invalid script -> index2.html
  }
});

// No script name = show index2.html
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Home page
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for all other unknown paths
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
