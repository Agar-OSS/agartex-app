const path = require('path');
const express = require('express');

const app = express();

var DIST_DIR = path.join(__dirname, '..', 'build');
app.use(express.static(DIST_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'favicon.ico'));
});

app.listen(5000, () => {
  console.log('Production server started on port 5000.');
});
