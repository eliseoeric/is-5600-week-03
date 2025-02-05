const path = require('path');
const querystring = require('querystring');
const EventEmitter = require('events');

const chatEmitter = new EventEmitter();

// const http = require('http');

// const port = process.env.PORT || 3000;

// // note that typically the variables here are `req` and `res` but we are using `request` and `response` for clarity
// const server = http.createServer(function(request, response) {
//   if (request.url === '/') return respondText(request, response);
//   if (request.url === '/json') return respondJson(request, response);
//   if (request.url.match(/^\/echo/)) return respondEcho(request, response);

//   respondNotFound(request, response);
// });

// server.listen(port, function() {
//   console.log(`Server is listening on port ${port}`);
// });
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
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}
/**
 * Responds with a 404 not found
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}
function respondEcho(req, res) {
  // req.query is an object that contains the query parameters
  const { input = '' } = req.query;

  // here we make use of res.json to send a json response with less code
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
