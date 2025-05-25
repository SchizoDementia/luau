const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const scriptDB = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json'), 'utf-8'));

app.use(express.static(__dirname));

function isBlockedAgent(req) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const accept = (req.headers.accept || '').toLowerCase();
  return ua.includes('mozilla') || ua.includes('chrome') || ua.includes('curl') ||
         accept.includes('text/html') || accept.includes('application/json');
}

app.get('/script/api/:name', (req, res) => {
  const scriptName = req.params.name.toLowerCase();
  if (isBlockedAgent(req)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  if (scriptDB[scriptName]) {
    res.type('text/plain');
    res.send(scriptDB[scriptName]);
  } else {
    res.status(404).send('');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
