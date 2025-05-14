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

// Detect if the request is from a browser (not Roblox or CLI)
function isBrowserRequest(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// Script API endpoint
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName;

  // Find matching script in the index
  const file = scriptIndex[scriptName];
  const filePath = file && path.join(__dirname, file);

  // If the script exists, process it
  if (file && fs.existsSync(filePath)) {
    const userAgent = req.headers['user-agent'] || '';
    const isRoblox = userAgent.includes("Roblox");

    // If the request is from Roblox (non-browser), serve raw Lua script
    if (isRoblox) {
      const content = fs.readFileSync(filePath, 'utf-8');
      res.type('text/plain');
      return res.send(content);
    }

    // If the request is from a browser, send index.html
    if (isBrowserRequest(req)) {
      return res.sendFile(path.join(__dirname, 'index.html'));
    }
  }

  // Fallback for invalid or unmatched script names
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback route for unmatched paths (invalid script or other URLs)
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
