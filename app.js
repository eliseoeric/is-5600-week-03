const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from /public (for chat.js)
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Basic endpoints ----------
app.get('/json', (req, res) => {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
});

app.get('/echo', (req, res) => {
  const input = (req.query.input || '').toString();
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
});

// ---------- Simple chat using SSE ----------
const chatEmitter = new EventEmitter();

// Send message: /chat?message=Hello
app.get('/chat', (req, res) => {
  const message = (req.query.message || '').toString();
  if (message) chatEmitter.emit('message', message);
  res.end();
});

// Server-Sent Events stream
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  });
  const onMessage = (msg) => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);
  req.on('close', () => chatEmitter.off('message', onMessage));
});

// Serve the chat UI at "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.listen(port, () => console.log(`Listening on ${port}`));
