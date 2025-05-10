const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();
  const dbPath = path.join(__dirname, 'index.json');

  if (!fs.existsSync(dbPath)) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  let scripts;
  try {
    scripts = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }

  if (scripts[scriptName]) {
    if (isBrowser(req)) {
      return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      res.type('text/plain');
      return res.send(scripts[scriptName]);
    }
  }

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

// Static files should be handled **last**, after all routes
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
