const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json
const indexPath = path.join(__dirname, 'index.json');
const scriptIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

// Serve static files (like HTML) from root
app.use(express.static(__dirname));

// Detect if request is from browser (not Roblox or CLI)
function isBrowserRequest(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// Script API endpoint
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName;

  // Find matching script
  const file = scriptIndex[scriptName];
  if (file && fs.existsSync(path.join(__dirname, file))) {
    if (isBrowserRequest(req)) {
      return res.sendFile(path.join(__dirname, 'index.html'));
    }

    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    res.type('text/plain');
    return res.send(content);
  }

  // Invalid script key
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
