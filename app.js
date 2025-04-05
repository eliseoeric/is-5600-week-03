
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const chatEmitter = new EventEmitter();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

//  the main HTML route to serve `chat.html`
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// Endpoint for simple plain text response
app.get('/text', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
});

// Endpoint for JSON data
app.get('/json', (req, res) => {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
});

// Endpoint to echo input 
app.get('/echo', (req, res) => {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
});

// Endpoint for sending  messages
app.get('/chat', (req, res) => {
  const { message } = req.query;
  if (message) {
    chatEmitter.emit('message', message);
  }
  res.end();
});

// Server-sent events endpoint for real-time chat updates
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', onMessage);

 
  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

// Start  server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});