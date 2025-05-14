const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Load index.json synchronously to ensure it's available when requests come in
let scriptIndex = {};
try {
  const indexPath = path.join(__dirname, 'index.json');
  const indexData = fs.readFileSync(indexPath, 'utf-8');
  scriptIndex = JSON.parse(indexData);
  console.log("Successfully loaded script index with", Object.keys(scriptIndex).length, "entries");
} catch (err) {
  console.error("Error loading index.json:", err);
}

// Serve static files (e.g., HTML, CSS, JS) from the root directory
app.use(express.static(__dirname));

// API route to serve Lua scripts based on the script name from index.json
app.get('/script/api/:scriptName', (req, res) => {
  const scriptName = req.params.scriptName?.toLowerCase();
  console.log(`Request for script: ${scriptName}`);

  // Check if the scriptName exists in index.json
  if (scriptIndex && scriptIndex.hasOwnProperty(scriptName)) {
    const scriptFile = scriptIndex[scriptName];
    const scriptPath = path.join(__dirname, 'scripts', scriptFile);
    console.log(`Mapped to file: ${scriptFile}, full path: ${scriptPath}`);

    // Ensure the script file exists before serving it
    if (fs.existsSync(scriptPath)) {
      const luaScript = fs.readFileSync(scriptPath, 'utf-8');
      console.log(`Serving script with length: ${luaScript.length}`);

      // Return Lua script as plain text (so loadstring can execute it)
      return res.type('text/plain').send(luaScript);
    } else {
      console.log(`Script file not found at path: ${scriptPath}`);
      // If the script file doesn't exist, return index1.html
      return res.sendFile(path.join(__dirname, 'index1.html'));
    }
  } else {
    console.log(`Script name not found in index: ${scriptName}`);
  }

  // If the scriptName is not in the index, return the fallback page (index1.html)
  return res.sendFile(path.join(__dirname, 'index1.html'));
});

// Serve the landing page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for unmatched routes (e.g., wrong script requests)
app.get('*', (req, res) => {
  if (req.path.toLowerCase().startsWith('/script/api/')) {
    return res.sendFile(path.join(__dirname, 'index1.html')); // Not found
  }
  return res.sendFile(path.join(__dirname, 'index2.html')); // General fallback
});

// Start the Express server on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
