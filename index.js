const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

const scripts = {
  't4vk1nm7eq9b2xz8': `print("TEST2")`,
  'g7ma2xp9ql3z8rb5': `print("TEST3")`,
  'abc123': `print("luau!")`
};

app.get('/api/script', (req, res) => {
  res.type('text/plain');
  return res.send(`print("Hi")`);
});

app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();

  if (scripts[scriptName]) {
    if (isBrowser(req)) {
      return res.sendFile(path.join(__dirname, 'index.html'));
    }
    res.type('text/plain');
    return res.send(scripts[scriptName]);
  }

  // Fallback for unknown scripts
  if (isBrowser(req)) {
    return res.sendFile(path.join(__dirname, 'index1.html'));
  }
  res.type('text/plain');
  return res.send(`-- invalid script`);
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
