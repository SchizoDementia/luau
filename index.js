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

const scripts = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json')));

app.get('/api/script', (req, res) => {
  res.type('text/plain');
  return res.send(`print("Hi")`);
});

app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  // Check if script exists in the index.json file
  if (scripts[scriptName]) {
    res.type('text/plain');
    return res.send(scripts[scriptName]);
  }

  // If no script is found, serve the default HTML page
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
