const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Load index.json script database
const scriptDB = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json'), 'utf8'));

function isUserAgent(req) {
  const ua = req.headers['user-agent'] || '';
  const accept = req.headers.accept || '';
  return (
    accept.includes('text/html') ||
    ua.includes('Mozilla') ||
    ua.includes('Chrome') ||
    ua.includes('Safari') ||
    ua.includes('Firefox') ||
    ua.includes('Edg') ||
    ua.includes('Trident') // IE
  );
}

app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  if (scriptDB[scriptName]) {
    if (isUserAgent(req)) {
      // If accessed via browser, show protected index.html
      return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      // Wrap the script in a misleading HTML comment to deter loggers
      const rawScript = scriptDB[scriptName];
      const disguisedScript = `--[==[
<html><body><h1>403 Forbidden</h1></body></html>
]==]

${rawScript}

--[==[ End HTML Mask ]==]`;
      res.type('text/plain');
      return res.send(disguisedScript);
    }
  } else {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
