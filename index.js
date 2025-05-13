const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const indexPath = path.join(__dirname, 'index.json');
const scriptIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

// Serve static files like HTML/CSS/JS
app.use(express.static(__dirname));

// Detect browser request by Accept header
function isBrowserRequest(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// Handle script ID requests
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  // Check index.json for match
  for (const key in scriptIndex) {
    if (key.toLowerCase() === scriptName) {
      const filePath = path.join(__dirname, 'scripts', scriptIndex[key]);

      if (fs.existsSync(filePath)) {
        // If browser, show GUI interface
        if (isBrowserRequest(req)) {
          return res.sendFile(path.join(__dirname, 'index.html'));
        }

        // If not browser (e.g., HttpGet), return raw Lua script
        res.type('text/plain');
        return res.send(fs.readFileSync(filePath, 'utf-8'));
      }
    }
  }

  // If script not found, show index1.html or error
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all route for invalid pages
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
