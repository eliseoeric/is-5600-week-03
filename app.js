// IMPORT MODULES
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;

// EVENT EMITTER FOR CHAT
const chatEmitter = new EventEmitter();

// MIDDLEWARE (serve static files)
app.use(express.static(__dirname + '/public'));

/**
 * Serve chat.html
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

/**
 * Plain text response
 */
function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

/**
 * JSON response
 */
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3]
  });
}

/**
 * Echo response
 */
function respondEcho(req, res) {
  const { input = '' } = req.query;

  res.json({
    normal: input,
    shorty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join('')
  });
}

/**
 * Chat endpoint
 */
function respondChat(req, res) {
  const { message } = req.query;

  if (message) {
    chatEmitter.emit('message', message);
  }

  res.end();
}

/**
 * Server-Sent Events (SSE)
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
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
 * ROUTES
 */
app.get('/', chatApp);
app.get('/text', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

/**
 * START SERVER
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});