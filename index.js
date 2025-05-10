const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load scripts from index.json
let scripts = {};
try {
  const jsonPath = path.join(__dirname, 'index.json');
  const json = fs.readFileSync(jsonPath, 'utf8');
  scripts = JSON.parse(json);
} catch (err) {
  console.error('Failed to load index.json:', err);
}

// Check if request is likely from a browser
function isBrowser(req) {
  const accept = req.headers['accept'] || '';
  const userAgent = req.headers['user-agent'] || '';
  return accept.includes('text/html') || /mozilla|chrome|safari|edge|firefox/i.test(userAgent);
}

// Serve static files
app.use(express.static(__dirname));

// API route for scripts
app.get('/script/api/:id', (req, res) => {
  const id = req.params.id.toLowerCase();
  const script = scripts[id];

  if (script) {
    // Found in index.json
    if (isBrowser(req)) {
      // Browser request, show UI instead of code
      return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      // Script client, send raw code
      res.type('text/plain');
      return res.send(script);
    }
  } else {
    // Not in index.json = show index1.html
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// All other random paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start server
app.listen(port, () => {
  console.log(`MoonVeil server running on port ${port}`);
});
