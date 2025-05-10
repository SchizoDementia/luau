const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json and normalize keys to lowercase
let scripts = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  const parsed = JSON.parse(data);
  for (let key in parsed) {
    scripts[key.toLowerCase()] = parsed[key];
  }
} catch (err) {
  console.error('Failed to load index.json:', err);
}

// Serve static files
app.use(express.static(__dirname));

// Route for valid or invalid script names
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();
  if (scripts.hasOwnProperty(scriptName)) {
    return res.sendFile(path.join(__dirname, 'index.html')); // Valid script
  } else {
    return res.sendFile(path.join(__dirname, 'index1.html')); // Invalid script
  }
});

// Route for /script/api with no scriptName
app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Route for homepage
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all route for all other paths
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
