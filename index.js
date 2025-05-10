const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

let scripts = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8');
  scripts = JSON.parse(data);
} catch (err) {
  console.error("Failed to load index.json:", err);
}

function isBrowser(req) {
  const accept = req.headers.accept || '';
  const ua = req.headers['user-agent'] || '';
  return accept.includes('text/html') || /mozilla|chrome|safari|edge|firefox/i.test(ua);
}

app.use(express.static(__dirname));

app.get('/script/api/:scriptName', (req, res) => {
  const id = req.params.scriptName?.toLowerCase();
  const script = scripts[id];

  if (script) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
});

app.get('/script/api', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
