const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (e.g., CSS, JS, images) from the root directory
app.use(express.static(__dirname));

// Middleware to detect if the request is from Roblox
function isRoblox(req) {
  const userAgent = req.headers['user-agent'] || '';
  // Roblox user-agents often include "Roblox" or similar identifiers
  return userAgent.includes('Roblox');
}

// Route for /api/script (always returns raw script)
app.get('/api/script', (req, res) => {
  res.type('text/plain');
  res.send(`print("Hi")`);
});

// Route for /script/api/:scriptName (specific scripts or index1.html)
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  if (scriptName === 'T4vK1nM7eQ9B2xZ8') {
    res.type('text/plain');
    return res.send(`print("TEST2")`);
  }

  if (scriptName === 'G7mA2xP9qL3Z8rB5') {
    res.type('text/plain');
    return res.send(`print("TEST3")`);
  }

  if (scriptName === 'abc123') {
    res.type('text/plain');
    return res.send(`print("luau!")`);
  }

  // Serve index1.html for unmatched script names
  res.sendFile(path.join(__dirname, 'index1.html'));
});

// Root route: Serve raw script for Roblox, index.html for browsers
app.get('/', (req, res) => {
  if (isRoblox(req)) {
    res.type('text/plain');
    return res.send(`print("luau!")`); // Default script for Roblox HttpGet
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all route for other paths
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  // Serve index.html for browsers, even on unmatched routes
  if (!isRoblox(req)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // Fallback for Roblox on unmatched routes (optional)
  res.type('text/plain');
  res.send(`print("Invalid route")`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
