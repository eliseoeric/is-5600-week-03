const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Responds with plain text
 */
function respondText(req, res) {
  res.type('text/plain').send('hi');
}

/**
 * Responds with JSON
 */
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

/**
 * Responds with a 404 Not Found
 */
function respondNotFound(req, res) {
  res.status(404).send('Not Found');
}

/**
 * Responds with input string transformations
 */
function respondEcho(req, res) {
  const input = req.query.input || '';

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

/**
 * Serves chat.html
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

/**
 * Receives a chat message and emits it
 */
function respondChat(req, res) {
  const message = req.query.message;

  if (message) {
    chatEmitter.emit('message', message);
  }

  res.sendStatus(200);
}

/**
 * SSE endpoint to push chat messages to clients
 */
function respondSSE(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');

  const onMessage = (msg) => {
    res.write(`data: ${msg}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// Routes
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);
app.get('/text', respondText);

// Catch-all 404 (must be last)
app.use(respondNotFound);

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});