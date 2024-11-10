const http = require('http');
const url = require('url');

const port = process.env.PORT || 3000;

/**
 * Responds with plain text
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

/**
 * Responds with JSON
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondJson(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ text: 'hi', numbers: [1, 2, 3] }));
}

/**
 * Responds with a 404 Not Found
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondNotFound(req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('404: Not Found');
}

// Create the server with routing logic
const server = http.createServer(function(request, response) {
  const parsedUrl = url.parse(request.url, true);
  
  // Routing based on URL path
  if (parsedUrl.pathname === '/text') {
    respondText(request, response);
  } else if (parsedUrl.pathname === '/json') {
    respondJson(request, response);
  } else {
    respondNotFound(request, response);
  }
});

// Start listening on the specified port
server.listen(port, function() {
  console.log(`Server is listening on port ${port}`);
});
/**
 * Responds with the input string in various formats
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondEcho(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const input = urlObj.searchParams.get('input') || '';

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
      normal: input,
      shouty: input.toUpperCase(),
      charCount: input.length,
      backwards: input.split('').reverse().join(''),
  }));
}
function respondJson(req, res) {
  // express has a built in json method that will set the content type header
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}
function respondJson(req, res) {
  // express has a built in json method that will set the content type header
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}
function respondEcho (req, res) {
  // req.query is an object that contains the query parameters
  const { input = '' } = req.query;

  // here we make use of res.json to send a json response with less code
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}