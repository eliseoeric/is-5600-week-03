const express = require('express');
const path = require('path');
const EventEmitter = require('events');
const app = express();
const port = process.env.PORT || 3000;

// Initialize EventEmitter
const chatEmitter = new EventEmitter();

// Serve static files (chat.js)
app.use(express.static(path.join(__dirname, 'public')));

// Serve chat.html at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// SSE endpoint
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');

  const sendMessage = (message) => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', sendMessage);

  req.on('close', () => {
    chatEmitter.off('message', sendMessage);
  });
});

// Chat endpoint
app.get('/chat', (req, res) => {
  const { message } = req.query;
  chatEmitter.emit('message', message);
  res.end();
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});