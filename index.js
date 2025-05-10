const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json
let scripts = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  scripts = JSON.parse(data);
} catch (err) {
  console.error("Failed to load index.json:", err);
}

// Serve static files
app.use(express.static(__dirname));

// Route for /script/api/:scriptName
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();
  const exists = scripts.hasOwnProperty(scriptName);

  if (exists) {
    return res.sendFile(path.join(__dirname, 'index.html')); // Valid script
  } else {
    return res.sendFile(path.join(__dirname, 'index1.html')); // Invalid script
  }
});

// Handle /script/api with no scriptName
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index1.html')); // No scriptName = treat as invalid
});

// Homepage
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// All other unknown paths
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html')); // Random paths
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
