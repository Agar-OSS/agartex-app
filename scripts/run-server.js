const path = require('path');
const express = require('express');
const fs = require('fs');
const https = require('https');

const ENABLE_TLS = process.env['ENABLE_TLS']
const TLS_CERT_PATH = '/config/cert.pem';
const TLS_KEY_PATH = '/config/key.pem';

const app = express();

var DIST_DIR = path.join(__dirname, '..', 'build');
app.use(express.static(DIST_DIR));

app.get('/*', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.get('/favicon.ico', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'favicon.ico'));
});

app.get('/example.pdf', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'example.pdf'));
});

if (ENABLE_TLS === 'true') {
  https.createServer({
    cert: fs.readFileSync(TLS_CERT_PATH),
    key: fs.readFileSync(TLS_KEY_PATH)
  }).listen(5000, () => {
    console.log('Production server started on port 5000 (SSL enabled).');
  });
} else {
  app.listen(5000, () => {
    console.log('Production server started on port 5000 (SSL disabled).');
  });
}
