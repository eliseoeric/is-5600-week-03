//const http = require('http');
//const url = require('url');

//const port = process.env.PORT || 3000;
const path = require('path');

const express = require('express');

const port = process.env.PORT || 3000;


const app = express();
const EventEmitter = require('events');

const chatEmitter = new EventEmitter();
// add this line just after we declare the express app
app.use(express.static(__dirname + '/public'));

// modify the server code to look like this
//const server = http.createServer(function(request, response) {
  //response.setHeader('Content-Type', 'application/json');
  //response.end(JSON.stringify({ text: 'hi', number: [1, 2, 3] }));
//   const parsedUrl = url.parse(request.url, true);
//   const pathname = parsedUrl.pathname;  

//   if (pathname === '/') return respondText(request, response);
//   if (pathname === '/json') return respondJson(request, response);
//   if (pathname.match(/^\/echo/)) return respondEcho(request, response);
  
//   respondNotFound(request, response);

// });
// server.listen(port, function() {
//   console.log(`Server is listening on port ${port}`);
// });

// function declarations for respondText, respondJson, respondNotFound and respondEcho stay here

//app.get('/', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
// register the endpoint with the app (make sure to remove the old binding to the `/` route)
app.get('/', chatApp)
app.get('/chat', respondChat);
app.get('/sse', respondSSE);
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

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
  // express has a built in json method that will set the content type header
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

/**
 * Responds with the input string in various formats
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
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

/**
 * Serves up the chat.html file
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

function respondChat (req, res) {
  const { message } = req.query;

  chatEmitter.emit('message', message);
  res.end();
}

function respondSSE (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = message => res.write(`data: ${message}\n\n`); // use res.write to keep the connection open, so the client is listening for new messages
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}