const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json to map script IDs to actual script filenames
const indexPath = path.join(__dirname, 'index.json');
let scriptIndex = {};

// Read the index.json file asynchronously and handle errors
fs.readFile(indexPath, 'utf-8', (err, data) => {
  if (err) {
    console.error("Error reading index.json:", err);
    return;
  }
  scriptIndex = JSON.parse(data);
});

// Serve static files (e.g., HTML, CSS, JS) from the root directory
app.use(express.static(__dirname));

// Function to check if request is from a browser (text/html request)
function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// API route that serves a basic script (testing)
app.get('/api/script', (req, res) => {
  res.type('text/plain');
  return res.send(`print("Hi")`);
});

// Serve the Lua script based on the requested scriptName
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  // Check if the scriptName exists in index.json
  if (scriptIndex.hasOwnProperty(scriptName)) {
    const scriptFile = scriptIndex[scriptName];
    const scriptPath = path.join(__dirname, 'scripts', scriptFile);

    // Ensure the script file exists before serving it
    if (fs.existsSync(scriptPath)) {
      // Serve the Lua script as plain text
      return res.type('text/plain').send(fs.readFileSync(scriptPath, 'utf-8'));
    }
  }

  // If script not found, send fallback page
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Main route (index.html) to serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for any unmatched routes (e.g., broken links or wrong script requests)
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html')); // Not found
  }

  return res.sendFile(path.join(__dirname, 'index2.html')); // General fallback
});

// Start the Express server on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
