const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Load scripts from index.json
let scriptData = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  scriptData = JSON.parse(data);
} catch (e) {
  console.error('index.json not found or invalid:', e);
}

// Check if request comes from a browser (basic detection)
function isBrowser(req) {
  const ua = req.headers['user-agent'] || '';
  return /mozilla|chrome|safari|firefox|edge/i.test(ua);
}

// Serve static files
app.use(express.static(__dirname));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Main script API handler
app.get('/script/api/:scriptName', (req, res) => {
  const name = req.params.scriptName.toLowerCase();
  const script = scriptData[name];

  if (script) {
    if (isBrowser(req)) {
      // Browser = show UI
      return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      // Script client = return code
      res.type('text/plain');
      return res.send(script);
    }
  } else {
    // Not found in index.json
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
});

// Catch-all fallback to index2.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`MoonVeil is live on port ${port}`);
});
