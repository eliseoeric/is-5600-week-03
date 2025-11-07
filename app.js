// app.js

const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;

// Chat message emitter
const chatEmitter = new EventEmitter();

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

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
 * Responds with input string in multiple formats
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
 * Serves the chat HTML page
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

/**
 * Handles incoming chat messages
 */
function respondChat(req, res) {
  const { message } = req.query;
  if (message && message.trim() !== '') {
    chatEmitter.emit('message', message);
  }
  res.end();
}

/**
 * Server-Sent Events endpoint
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = (msg) => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// Routes
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
