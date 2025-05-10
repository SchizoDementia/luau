const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json once at startup
let scriptData = {};
try {
  const jsonPath = path.join(__dirname, 'index.json');
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  scriptData = JSON.parse(jsonContent);
} catch (err) {
  console.error('Failed to load index.json:', err);
}

// Detects whether a request is likely from a browser
function isLikelyBrowser(req) {
  const userAgent = req.headers['user-agent'] || '';
  return /mozilla|chrome|safari|edge|firefox/i.test(userAgent);
}

// Serve static files
app.use(express.static(__dirname));

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Script API
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  // If script exists in index.json
  if (scriptData[scriptName]) {
    if (isLikelyBrowser(req)) {
      // Show index.html for browser users
      return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      // Return raw script for non-browsers
      res.type('text/plain');
      return res.send(scriptData[scriptName]);
    }
  }

  // If script not found
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// All other paths → index2.html
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
