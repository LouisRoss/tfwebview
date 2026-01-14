const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url);
    const extname = path.extname(filePath);

    // Manual mapping
    if (extname === '.js' || extname === '.mjs') {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        fs.createReadStream(filePath).pipe(res);
    }
}).listen(3000);


const PORT = process.env.PORT || 5173;

// Basic MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const PUBLIC_DIR = __dirname; // serve files from this directory

const server = http.createServer((req, res) => {
  // Normalize URL and prevent path traversal
  let requestedPath = decodeURIComponent(req.url.split('?')[0]);
  if (requestedPath === '/') requestedPath = '/index.html';
  const safePath = path.normalize(requestedPath).replace(/^\.+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);
  console.log(`Browser requested file ${filePath}`)

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/javascript';
    console.log(`Using content type ${contentType}`)
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

// Attach WebSocket server to the same HTTP server on the '/ws' path
console.log('Starting WebSocket server on /ws');
const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  console.log('WebSocket: client connected');

  ws.on('message', (message) => {
    console.log('WebSocket received:', message);
    // Echo back with prefix
    ws.send(JSON.stringify({ from: 'server', echo: String(message) }));
  });

  ws.on('close', () => {
    console.log('WebSocket: client disconnected');
  });

  ws.send(JSON.stringify({ from: 'server', message: 'Welcome to the WebSocket server!' }));
});

server.listen(PORT, () => {
  console.log(`HTTP server running at http://localhost:${PORT}/`);
  console.log(`WebSocket endpoint available at ws://localhost:${PORT}/ws`);
});
