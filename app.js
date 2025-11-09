// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const chatEmitter = new EventEmitter();
const port = process.env.PORT || 3000;

// serve static assets from public
app.use(express.static(__dirname + '/public'));

/**
 * Responds with plain text (not used as root - optional)
 */
function respondText(req, res) {
  res.type('text/plain');
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
 * Responds with echo transforms
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
 * Serves chat.html from project root
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

/**
 * Receive chat message (via GET query ?message=...)
 */
function respondChat(req, res) {
  const { message } = req.query;
  if (message) {
    chatEmitter.emit('message', message);
    console.log('chat message:', message);
  }
  res.end();
}

/**
 * SSE: push chat messages to connected clients
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  });

  const onMessage = message => {
    // escape newlines just in case
    const safe = String(message).replace(/\n/g, ' ');
    res.write(`data: ${safe}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  // When client disconnects, remove listener
  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// Routes
app.get('/', chatApp);        // serve the chat UI
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);
app.get('/text', respondText); // optional

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
