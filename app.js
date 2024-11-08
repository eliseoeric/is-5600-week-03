// Import necessary modules
const http = require('http');
const url = require('url');
const express = require('express');
const EventEmitter = require('events');
const path = require('path');

// Initialize app with Express
const app = express();
const port = process.env.PORT || 3000;

// Set up chat event emitter
const chatEmitter = new EventEmitter();
app.use(express.static(__dirname + '/public'));

function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

// Respond with JSON data
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

// Respond with input string in various formats
function respondEcho(req, res) {
  const { input = '' } = req.query;

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

// 404 Response for unmatched routes
function respondNotFound(req, res) {
  res.status(404).send('Not Found');
}

// Serve the chat.html file
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

// Register routes with Express
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);

// Chat endpoint to handle messages
app.get('/chat', (req, res) => {
  const { message } = req.query;

  chatEmitter.emit('message', message);
  res.end();
});

// SSE endpoint to broadcast messages to clients
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = (message) => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
