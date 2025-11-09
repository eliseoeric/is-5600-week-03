// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 4000;

// Chat event emitter
const chatEmitter = new EventEmitter();

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---

// 1. Serve chat HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// 2. JSON response
app.get('/json', (req, res) => {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
});

// 3. Echo route
app.get('/echo', (req, res) => {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
});

// 4. Receive chat messages
app.get('/chat', (req, res) => {
  const { message } = req.query;
  if (message) chatEmitter.emit('message', message);
  res.end();
});

// 5. SSE endpoint for broadcasting chat
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const onMessage = msg => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

// 404 route
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
