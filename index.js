const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve index.html and static assets
app.use(express.static(__dirname));

// Detect browser visits
function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// API/script or custom path handler
app.get(['/api/script', '/:custom'], (req, res) => {
  const custom = req.params.custom?.toLowerCase();

  if (isBrowser(req)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  if (req.path.toLowerCase() === '/api/script' || custom === 'custom') {
    res.type('text/plain');
    return res.send(`print("Hi")`);
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
