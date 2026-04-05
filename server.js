const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Home Route' }));
    return;
  }

  if (req.url === '/about') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'About Route' }));
    return;
  }

  if (req.url === '/chat') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Chat Route' }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: '404 Not Found' }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});
