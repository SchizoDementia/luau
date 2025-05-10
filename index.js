const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

const indexJsonPath = path.join(__dirname, 'index.json');
let scriptMap = {};

// Load index.json
if (fs.existsSync(indexJsonPath)) {
  try {
    scriptMap = JSON.parse(fs.readFileSync(indexJsonPath, 'utf-8'));
  } catch (err) {
    console.error('Failed to parse index.json:', err);
  }
}

app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName.toLowerCase();

  if (scriptMap[scriptName]) {
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.sendFile(path.join(__dirname, 'index.html')); // show index.html if accessed from browser
    }

    res.type('text/plain');
    return res.send(scriptMap[scriptName]); // return raw script for game
  }

  // Invalid scriptName, show index1.html
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all for other paths (index2.html)
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index2.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
