const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const chatEmitter = new EventEmitter();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Endpoint for a simple plain text response
app.get('/text', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('hi');
});

// Endpoint for JSON data response
app.get('/json', (req, res) => {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
});

// Endpoint to echo input with transformations
app.get('/echo', (req, res) => {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
});

// Endpoint to send messages to the chat
app.get('/chat', (req, res) => {
  const { message } = req.query;
  if (message) {
    chatEmitter.emit('message', message); // Emit message event
  }
  res.end();
});

// Server-Sent Events (SSE) endpoint for real-time chat updates
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // Listener function to send messages to clients
  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  // Attach the message event listener
  chatEmitter.on('message', onMessage);

  // Remove listener when the client disconnects
  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
