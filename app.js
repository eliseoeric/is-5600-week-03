// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');
const url = require('url');

const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

// Step 1: Define Response Functions

// Responds with a plain text message
function respondText(req, res) {
  res.type('text/plain');
  res.send('hi');
}

// Responds with a JSON object
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

// Echoes the input query in various formats
function respondEcho(req, res) {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

// Serves the main chat application
function respondChat(req, res) {
  const { message } = req.query;
  if (message) chatEmitter.emit('message', message);
  res.end();
}

// Handles Server-Sent Events (SSE) for live chat updates
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const onMessage = message => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// Step 2: Define Routes

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/chat.html')));
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// Step 3: Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
