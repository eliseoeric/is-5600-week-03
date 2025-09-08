// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Route: / (serves chat.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Route: /json (returns static JSON)
app.get('/json', (req, res) => {
  res.json({ message: 'Hello from JSON!', numbers: [1, 2, 3] });
});

// Route: /echo?input=hello
app.get('/echo', (req, res) => {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
});

// Route: /chat?message=hi (broadcasts message)
app.get('/chat', (req, res) => {
  const { message } = req.query;
  if (message) {
    chatEmitter.emit('message', message);
  }
  res.status(200).end();
});

// Route: /sse (server-sent events)
app.get('/sse', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders();

  const onMessage = (msg) => {
    res.write(`data: ${msg}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
