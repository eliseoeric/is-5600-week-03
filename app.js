// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

// Serve static files (chat.js, css)
app.use(express.static(path.join(__dirname, 'public')));

// Serve chat.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// SSE endpoint
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendMessage = message => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', sendMessage);

  req.on('close', () => {
    chatEmitter.off('message', sendMessage);
  });
});

// Chat message endpoint
app.get('/chat', (req, res) => {
  const { message = '' } = req.query;
  if (message.trim() !== '') {
    chatEmitter.emit('message', message);
  }
  res.end();
});

app.listen(port, () => console.log(`✅ Chat server running on port ${port}`));
