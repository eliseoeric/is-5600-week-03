const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // ROUTING
  if (req.url === '/') {
    res.end(JSON.stringify({ message: "Home Route" }));
  } 
  else if (req.url === '/api') {
    res.end(JSON.stringify({ message: "Hello from API" }));
  } 
  else if (req.url === '/chat') {
    res.end(JSON.stringify({ message: "Chat Route" }));
  } 
  else {
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("HTTP Server running on port 3000");
});