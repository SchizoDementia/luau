const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json and lowercase keys
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

// Script API with scriptName check
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();
  console.log("Request to /script/api/:scriptName =", scriptName);

  if (scripts.hasOwnProperty(scriptName)) {
    console.log("Valid scriptName, sending index.html");
    return res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    console.log("Invalid scriptName, sending index1.html");
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
});

// Script API without a name
app.get('/script/api', (req, res) => {
  console.log("Request to /script/api (no scriptName), sending index1.html");
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Root
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all route
app.get('*', (req, res) => {
  console.log("Catch-all route hit:", req.path);
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
