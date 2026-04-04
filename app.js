const path = require('path');
const express = require('express');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;

const chatEmitter = new EventEmitter();

// serve static files (chat.js)
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
 * Responds with echo
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
 * Serve chat.html
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

/**
 * Chat endpoint
 */
function respondChat(req, res) {
  const { message } = req.query;
  chatEmitter.emit('message', message);
  res.end();
}

/**
 * SSE endpoint
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = message => res.write(`data: ${message}\n\n`);

  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

/* ROUTES */
app.get('/', chatApp);        // IMPORTANT: serves chat.html
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

/* START SERVER */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});