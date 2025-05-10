const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

let scripts = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  scripts = JSON.parse(data);
} catch (err) {
  console.error("Failed to load index.json:", err);
}

// Detect if request is from a browser
function isBrowser(req) {
  const accept = req.headers.accept || '';
  const ua = req.headers['user-agent'] || '';
  return accept.includes('text/html') || /mozilla|chrome|safari|edge|firefox/i.test(ua);
}

app.use(express.static(__dirname));

// Handle valid or invalid scriptName
app.get('/script/api/:scriptName', (req, res) => {
  const id = req.params.scriptName?.toLowerCase();
  const script = scripts[id];

  if (script) {
    if (isBrowser(req)) {
      return res.sendFile(path.join(__dirname, 'index.html')); // Show pretty UI
    } else {
      res.type('text/plain');
      return res.send(script); // Lua/cURL/etc.
    }
  } else {
    return res.sendFile(path.join(__dirname, 'index2.html')); // Unknown ID
  }
});

// No script name provided
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Root site
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// All other unknown routes
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
