const path = require('path');
const express = require('express');

const app = express();

var DIST_DIR = path.join(__dirname, '..', 'build');
app.use(express.static(DIST_DIR));

app.get('/', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.get('/:projectId', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.get('/login', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.get('/create-account', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.get('/favicon.ico', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'favicon.ico'));
});

app.get('/example.pdf', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'example.pdf'));
});

app.listen(5000, () => {
  console.log('Production server started on port 5000.');
});
