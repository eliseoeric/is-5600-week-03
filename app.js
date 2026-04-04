const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;

const chatEmitter = new EventEmitter();

// serve static files
app.use(express.static(__dirname + '/public'));

/**
 * Responds with plain text
 */
function respondText(req, res) {
  res.send('hi');
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
 * Responds with input transformations
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
 * 404 handler
 */
function respondNotFound(req, res) {
  res.status(404).send('Not Found');
}

/**
 * Serve chat UI
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

/**
 * Receive chat message
 */
function respondChat(req, res) {
  const { message } = req.query;

  if (message) {
    chatEmitter.emit('message', message);
  }

  res.end();
}

/**
 * SSE endpoint (FIXED VERSION)
 */
function respondSSE(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.flushHeaders();

  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// ROUTES
app.get('/', chatApp);
app.get('/text', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// fallback
app.use(respondNotFound);

// START SERVER
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Done by sharana
