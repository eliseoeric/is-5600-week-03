const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json');

  let data;

  if (request.url === '/') {
    data = { message: "Home Route" };

  } else if (request.url === '/about') {
    data = { message: "About Route" };

  } else if (request.url === '/chat') {
    data = [
      { id: 1, user: 'Alice', message: 'Hello everyone!', timestamp: '2024-01-01T10:00:00Z' },
      { id: 2, user: 'Bob', message: 'Hi Alice!', timestamp: '2024-01-01T10:01:00Z' }
    ];

  } else {
    response.statusCode = 404;
    data = { message: "404 Not Found" };
  }

  response.end(JSON.stringify(data));
});

server.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});