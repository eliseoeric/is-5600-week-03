const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

// Serve static files (chat.js)
app.use(express.static(__dirname + '/public'));

// ROUTES

// Route for serving chat.html
app.get('/', chatApp);

// Returns plain text
app.get('/text', respondText);

// Returns JSON
app.get('/json', respondJson);

// Echo route with input transformations
app.get('/echo', respondEcho);

// Chat message sender
app.get('/chat', respondChat);

// SSE stream for receiving messages
app.get('/sse', respondSSE);

// Fallback for 404
app.use(respondNotFound);

// SERVER START
app.listen(port, () => {
  console.log(`✅ Server is listening on http://localhost:${port}`);
});


// HANDLERS

function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

function respondEcho(req, res) {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

function respondChat(req, res) {
  const { message } = req.query;
  if (message) {
    console.log('Message received:', message);
    chatEmitter.emit('message', message);
  }
  res.end();
}

function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = (msg) => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

function respondNotFound(req, res) {
  res.status(404).send('Not Found');
}
