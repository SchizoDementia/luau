const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json to map script IDs to actual script filenames
const indexPath = path.join(__dirname, 'index.json');
const scriptIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

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

// Serve the Lua script in a hidden way by injecting it into the HTML
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  // Check if the scriptName exists in index.json
  if (scriptIndex[scriptName]) {
    const filePath = path.join(__dirname, 'scripts', scriptIndex[scriptName]);

    // Ensure the script file exists before serving it
    if (fs.existsSync(filePath)) {
      // Serve the Lua content directly as plain text (not raw HTML)
      res.type('text/plain');  // Ensure it's treated as plain text (Lua code)
      return res.send(fs.readFileSync(filePath, 'utf-8'));
    }
  }

  // If the script is not found, serve the index1.html page (fallback)
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Main route (index.html) to serve landing page
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
