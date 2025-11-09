// Import required modules
const http = require('http');
const url = require('url');
const path = require('path');
const express = require('express');
const EventEmitter = require('events');

// Set up port from environment or default to 3000
const port = process.env.PORT || 3000;

// Create Express app
const app = express();

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Create chat event emitter for broadcasting messages
const chatEmitter = new EventEmitter();

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
function respondEcho(req, res) {
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

/**
 * Handles chat messages from clients
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondChat(req, res) {
  const { message } = req.query;

  chatEmitter.emit('message', message);
  res.end();
}

/**
 * This endpoint will respond to the client with a stream of server sent events
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  // use res.write to keep the connection open, so the client is listening for new messages
  const onMessage = message => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// Register routes with Express
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});