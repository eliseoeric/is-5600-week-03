const EventEmitter = require('events');
const path = require('path');
const express = require('express');

const chatEmitter = new EventEmitter();
const port = process.env.PORT || 3000;
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Serves up the chat.html file
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

/**
 * Responds with plain text
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
 * Responds with the input string in various formats
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
 * Responds to /chat by emitting a message event
 */
function respondChat(req, res) {
  const { message } = req.query;

  if (message) {
    chatEmitter.emit('message', message);
  }
  res.end();
}

/**
 * Responds with a stream of server-sent events
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const onMessage = (message) => res.write(`data: ${message}\n\n`);

  chatEmitter.on('message', onMessage);

  // Clean up when the client disconnects
  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

/**
 * Responds with 404 Not Found
 */
function respondNotFound(req, res) {
  res.status(404).type('text/plain').send('Not Found');
}

// Routes
app.get('/', chatApp);       // serves chat.html
app.get('/text', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat); // send messages
app.get('/sse', respondSSE);   // receive messages
app.use(respondNotFound);

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
