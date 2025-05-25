const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const scriptDB = require('./index.json');

// Helper: Only allow loadstring, block all others (print, setclipboard, user-agent)
function isBlocked(req) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const accept = (req.headers['accept'] || '').toLowerCase();
  const referrer = req.headers['referer'] || '';

  // Block any web visits, bots, loggers
  return accept.includes('text/html')
      || ua.includes('mozilla') || ua.includes('chrome') || ua.includes('safari')
      || ua.includes('windows') || ua.includes('macintosh')
      || referrer !== '';
}

app.use(express.static(__dirname));

app.get('/script/api/:name', (req, res) => {
  const scriptName = req.params.name.toLowerCase();

  // Block anything not using loadstring()
  if (isBlocked(req)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // If script is valid and requested via loadstring
  if (scriptDB[scriptName]) {
    res.type('text/plain');
    return res.send(scriptDB[scriptName]);
  }

  // If script not found or anything else
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
