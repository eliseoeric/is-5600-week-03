const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const chatEmitter = new EventEmitter();
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from /public (e.g., chat.js, tachyons.min.css, chat.css)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the chat UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// SSE endpoint to stream messages to the client
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const onMessage = (msg) => {
    res.write(`data: ${msg}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

// Handle incoming messages and broadcast them
app.get('/chat', (req, res) => {
  const { message } = req.query;

  if (message && message.trim() !== '') {
    chatEmitter.emit('message', message.trim());
  }

  res.end();
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});