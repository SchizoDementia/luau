const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Static files
app.use(express.static(__dirname));

// Load index.json
let scriptData = {};
try {
  scriptData = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8'));
} catch (err) {
  console.error('Could not read index.json:', err);
}

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Script API route
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  // Check for User-Agent or Accept headers to detect browser (safely)
  const userAgent = req.headers['user-agent'] || '';
  const isLikelyBrowser = userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari');

  if (isLikelyBrowser) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  const scriptOutput = scriptData[scriptName];
  if (scriptOutput) {
    res.type('text/plain');
    return res.send(scriptOutput);
  }

  // Fallback
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// All other routes
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
