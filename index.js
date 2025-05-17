const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (e.g., CSS, JS, images) from the root directory
app.use(express.static(__dirname));

// Middleware to detect if the request is from Roblox
function isRoblox(req) {
  const userAgent = req.headers['user-agent'] || '';
  // Roblox user-agents typically include "Roblox" or "WinInet"
  return userAgent.includes('Roblox') || userAgent.includes('WinInet');
}

// Middleware to force index.html for non-Roblox requests
app.use((req, res, next) => {
  if (!isRoblox(req)) {
    // Serve index.html for all non-Roblox requests
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  next(); // Continue to specific routes for Roblox
});

// Route for /api/script (Roblox only)
app.get('/api/script', (req, res) => {
  res.type('text/plain');
  res.send(`print("Hi")`);
});

// Route for /script/api/:scriptName (Roblox only)
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

  // Serve index1.html for invalid script names (Roblox or not)
  res.sendFile(path.join(__dirname, 'index1.html'));
});

// Root route for Roblox
app.get('/', (req, res) => {
  res.type('text/plain');
  res.send(`print("luau!")`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
