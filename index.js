const express = require('express');
const path = require('path');
const fs = require('fs'); // To read the index.json file
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// Read and parse the index.json file to load the scripts
const scripts = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json')));

app.get('/api/script', (req, res) => {
  res.type('text/plain');
  return res.send(`print("Hi")`);
});

// Handle requests to script API and return the corresponding script or index.html
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  // Check if the script is in the index.json file
  if (scripts[scriptName]) {
    // Script found, return index.html after serving the script
    res.type('text/plain');
    return res.send(scripts[scriptName]);
  }

  // If no script is found, serve index.html
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the home page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for any other paths
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    // If a script request was made, serve index.html
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // For all other paths, serve a fallback page
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
