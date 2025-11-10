// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();

const chatEmitter = new EventEmitter();

/**
 * Responds with plain text
 */
function respondText(req, res) {
  // For Express: res.send will set content-type automatically
  res.type('text').send('hi');
}

/**
 * Responds with JSON
 */
function respondJson(req, res) {
  // Express helper sets Content-Type and stringifies
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

/**
 * Responds with a 404 not found
 */
function respondNotFound(req, res) {
  res.status(404).type('text').send('Not Found');
}

/**
 * Responds with the input string in various formats
 */
function respondEcho(req, res) {
  // req.query contains parsed query parameters in Express
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
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

/**
 * Responds to /chat to receive a message
 */
function respondChat(req, res) {
  const { message = '' } = req.query;

  // emit the message to all SSE listeners
  chatEmitter.emit('message', message);
  // respond with 200 OK and empty body
  res.end();
}

/**
 * Server-Sent Events endpoint
 * Keeps the connection open and sends messages as they arrive
 */
function respondSSE(req, res) {
  // Required headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // When a message is emitted, send it to this client
  const onMessage = (message) => {
    // SSE format: data: <message>\n\n
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  // If client disconnects, remove listener
  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

/* ------------------- Express setup ------------------- */

// serve static assets from ./public
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', chatApp);           // serves chat.html
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);  // called by client to send message (GET ?message=)
app.get('/sse', respondSSE);

// fallback for 404s (for any other path)
app.use((req, res) => respondNotFound(req, res));

// start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
