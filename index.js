const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load and parse index.json
let scripts = {};
try {
  const jsonPath = path.join(__dirname, 'index.json');
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const parsed = JSON.parse(raw);
  for (let key in parsed) {
    scripts[key.toLowerCase()] = parsed[key];
  }
  console.log('Loaded scripts from index.json');
} catch (err) {
  console.error('Failed to load index.json:', err);
}

// Serve static files (like index.html, index1.html, etc.)
app.use(express.static(__dirname));

// Handle exact script routes
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName.toLowerCase();

  if (scripts.hasOwnProperty(scriptName)) {
    // VALID script: show index.html (do NOT send the script code here!)
    return res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    // INVALID script: show index1.html
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
});

// Optional: if /script/api (no scriptName) is visited
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Homepage
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all for unknown/random routes
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
