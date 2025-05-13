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
function isBrowserRequest(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// Route to handle script requests
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  // Check if the scriptName exists in index.json
  for (const key in scriptIndex) {
    if (key.toLowerCase() === scriptName) {
      const filePath = path.join(__dirname, 'scripts', scriptIndex[key]);

      // Ensure the script file exists before serving it
      if (fs.existsSync(filePath)) {
        if (isBrowserRequest(req)) {
          // Serve index.html for browser requests
          return res.sendFile(path.join(__dirname, 'index.html'));
        } else {
          // Serve raw Lua script for non-browser requests
          res.type('text/plain');
          return res.send(fs.readFileSync(filePath, 'utf-8'));
        }
      }
    }
  }

  // If script not found, send fallback page
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Main route (index.html) to serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for any unmatched routes
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
