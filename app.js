const http = require('http');
const url = require('url');

const port = 3000;

// Home route
function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

// JSON route
function respondJson(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ text: 'hi', numbers: [1, 2, 3] }));
}

// Echo route
function respondEcho(req, res, query) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ you_sent: query }));
}

// Not found
function respondNotFound(req, res) {
  res.writeHead(404);
  res.end('Not Found');
}

// Server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  if (path === '/') return respondText(req, res);
  if (path === '/json') return respondJson(req, res);
  if (path === '/echo') return respondEcho(req, res, parsedUrl.query);

  respondNotFound(req, res);
});

// Start server
server.listen(port, () => {
  console.log('Server running');
});

