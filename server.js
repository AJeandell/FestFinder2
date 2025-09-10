const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// Import your festival entities (adjust path as needed)
const festivals = require('./src/festivals.js').default || require('./src/festivals.js');

// Sample API endpoint to get all festivals
app.get('/api/festivals', (req, res) => {
  res.json(festivals);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
