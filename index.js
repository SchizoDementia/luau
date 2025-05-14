const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

// Detect if the request is likely from a browser
function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// Serve specific files like .lua or .json
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName;
  const ext = path.extname(scriptName).toLowerCase();
  const allowedExtensions = ['.lua', '.json'];

  // Only serve .lua and .json
  if (!allowedExtensions.includes(ext)) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  const filePath = path.join(__dirname, scriptName);

  // Send the file if it exists, else fallback
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving ${scriptName}:`, err.message);
      return res.sendFile(path.join(__dirname, 'index1.html'));
    }
  });
});

// API route example (optional)
app.get('/api/script', (req, res) => {
  res.type('text/plain');
  res.send('API script endpoint');
});

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all route
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
