const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json and normalize keys to lowercase
let scripts = {};
try {
  const rawData = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  const parsed = JSON.parse(rawData);
  for (let key in parsed) {
    scripts[key.toLowerCase()] = parsed[key];
  }
  console.log("Loaded scripts:", Object.keys(scripts));
} catch (err) {
  console.error("Failed to load index.json:", err);
}

// Serve static files
app.use(express.static(__dirname));

// Route for valid or invalid script names
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();
  console.log("Requested scriptName:", scriptName);

  if (scripts.hasOwnProperty(scriptName)) {
    console.log("Valid scriptName. Serving index.html");
    return res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    console.log("Invalid scriptName. Serving index1.html");
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
});

// Route for /script/api with no scriptName
app.get('/script/api', (req, res) => {
  console.log("No scriptName provided. Serving index1.html");
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Route for homepage
app.get('/', (req, res) => {
  console.log("Homepage accessed. Serving index.html");
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all route for all other paths
app.get('*', (req, res) => {
  console.log("Unknown path accessed:", req.path, ". Serving index2.html");
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
