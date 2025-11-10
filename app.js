// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;

// Chat message emitter
const chatEmitter = new EventEmitter();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// -------------------
// Response functions
// -------------------

function respondJson(req, res) {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
}

function respondEcho(req, res) {
  const input = req.query.input || '';
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join('')
  });
}

// -------------------
// Routes
// -------------------

// Serve chat.html at '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// JSON endpoint
app.get('/json', respondJson);

// Echo endpoint
app.get('/echo', respondEcho);

// Receive a chat message
app.get('/chat', (req, res) => {
  const message = req.query.message || '';
  if (message) {
    chatEmitter.emit('message', message);
  }
  res.end();
});

// Server-Sent Events endpoint for chat
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// -------------------
// Start server
// -------------------
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
