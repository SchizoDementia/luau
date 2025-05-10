const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json (script map)
let scripts = {};
try {
  const jsonPath = path.join(__dirname, 'index.json');
  scripts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (err) {
  console.error('Error loading index.json:', err);
}

// Simple browser detection
function isBrowser(req) {
  const ua = req.headers['user-agent'] || '';
  return /mozilla|chrome|safari|firefox|edge/i.test(ua);
}

// Serve static files (if needed)
app.use(express.static(__dirname));

// Main route for script API
app.get('/script/api/:id', (req, res) => {
  const id = req.params.id.toLowerCase();
  const script = scripts[id];

  if (script) {
    if (isBrowser(req)) {
      return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      res.type('text/plain');
      return res.send(script);
    }
  } else {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for any other random path
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
