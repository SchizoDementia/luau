const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

// Helper to detect browser-like requests
function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// Example API endpoint (fix syntax)
app.get('/api/script', (req, res) => {
  res.type('text/plain');
  return res.send('Hello from /api/script');
});

// Serve specific Lua scripts
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();
  const scriptPath = path.join(__dirname, scriptName);

  // Security: Only allow specific extensions or filenames
  if (!scriptName.endsWith('.lua')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  res.sendFile(scriptPath, (err) => {
    if (err) {
      return res.sendFile(path.join(__dirname, 'index1.html'));
    }
  });
});

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all for undefined routes
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
