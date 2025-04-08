const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

// Serve static files from public folder (chat.js, CSS)
app.use(express.static(__dirname + '/public'));

// Function to serve chat.html when / is visited
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// Respond with JSON data
app.get('/json', (req, res) => {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
});

// Echo route with string transformations
app.get('/echo', (req, res) => {
  const { input = '' } = req.query;

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
});

// Chat endpoint – sends message to all connected clients
app.get('/chat', (req, res) => {
  const { message } = req.query;
  console.log('Received message:', message);
  chatEmitter.emit('message', message);
  res.end();
});

// SSE endpoint – keeps connection open for new messages
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = (msg) => {
    res.write(`data: ${msg}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
