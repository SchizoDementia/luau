const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json (script ID to filename)
const indexPath = path.join(__dirname, 'index.json');
const scriptIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

// Serve static files (e.g. index.html) from root directory
app.use(express.static(__dirname));

// Check if request is from browser (Accept header includes text/html)
function isBrowserRequest(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// Serve Lua scripts or index.html depending on request type
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  for (const key in scriptIndex) {
    if (key.toLowerCase() === scriptName) {
      const filePath = path.join(__dirname, scriptIndex[key]);

      if (fs.existsSync(filePath)) {
        if (isBrowserRequest(req)) {
          return res.sendFile(path.join(__dirname, 'index.html')); // Show index.html to browsers
        }

        res.type('text/plain');
        return res.send(fs.readFileSync(filePath, 'utf-8')); // Return Lua script to Roblox
      }
    }
  }

  return res.sendFile(path.join(__dirname, 'index1.html')); // Script ID not found
});

// Root page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for anything else
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
