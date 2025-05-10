const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json scripts
let scripts = {};
try {
  const jsonPath = path.join(__dirname, 'index.json');
  const raw = fs.readFileSync(jsonPath, 'utf8');
  scripts = JSON.parse(raw);
  console.log('[LOG] index.json loaded');
} catch (e) {
  console.error('[ERROR] Failed to load index.json:', e);
}

// Serve static files like index.html, index1.html, etc.
app.use(express.static(__dirname));

// Lua script delivery
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName.toLowerCase();
  const script = scripts[scriptName];

  if (script) {
    res.type('text/plain');
    return res.send(script); // Return raw Lua script
  } else {
    return res.sendFile(path.join(__dirname, 'index1.html')); // Unknown script
  }
});

// Handle /script/api with no scriptName
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Root/home
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for all other paths
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server is live at port ${port}`);
});
