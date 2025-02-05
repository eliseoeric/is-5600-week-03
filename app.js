const http = require('http');
const url = require('url');

const port = process.env.PORT || 3000;

// note that typically the variables here are `req` and `res` but we are using `request` and `response` for clarity
const server = http.createServer(function(request, response) {
  response.end("hi");
});

server.listen(port, function() {
  console.log(`Server is listening on port ${port}`);
});