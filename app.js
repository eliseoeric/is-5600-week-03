// app.js
// ======================================
// Import dependencies
// ======================================
const http = require('http');
const url = require('url');
const path = require('path');
const EventEmitter = require('events');
const express = require('express');

// ======================================
// Initialize Express app
// ======================================
const port = process.env.PORT || 3000;
const app = express();

// Allow static files from "public" folder
app.use(express.static(__dirname + '/public'));

// ======================================
// Event emitter for chat
// ======================================
const chatEmitter = new EventEmitter();

// ======================================
// Listener functions
// ======================================

/**
 * Responds with plain text
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

/**
 * Responds with JSON
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
 * Responds with the input string in various formats
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondEcho(req, res) {
  const { input = '' } = req.query;
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
 * Responds when user sends chat message
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondChat(req, res) {
  const { message } = req.query;
  if (message) {
    chatEmitter.emit('message', message);
    console.log('Message received:', message);
  }
  res.end();
}

/**
 * Server-Sent Events endpoint
 * Streams new messages to all clients
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

/**
 * 404 Not Found handler (for safety)
 */
function respondNotFound(req, res) {
  res.status(404).send('Not Found');
}

// ======================================
// Express route bindings
// ======================================
app.get('/', chatApp);            // Chat app home
app.get('/json', respondJson);    // JSON example
app.get('/echo', respondEcho);    // Dynamic echo API
app.get('/chat', respondChat);    // Chat message sender
app.get('/sse', respondSSE);      // Server-sent event stream

// Catch-all for undefined routes
app.use(respondNotFound);

// ======================================
// Start server
// ======================================
app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
