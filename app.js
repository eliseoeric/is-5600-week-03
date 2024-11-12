const express = require('express');
const path = require('path');
const EventEmitter = require('events');

// Initialize the express app
const app = express();
const port = process.env.PORT || 3000;

// Create an event emitter for broadcasting chat messages
const chatEmitter = new EventEmitter();

// Middleware to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Function to serve up the chat.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// Endpoint to handle incoming chat messages
app.get('/chat', (req, res) => {
  const { message } = req.query;
  if (message) {
    chatEmitter.emit('message', message); // Emit the message to all clients
  }
  res.end();
});

// Endpoint to handle Server-Sent Events for real-time message updates
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  });

  // Listener to send each new message to the client
  const onMessage = (message) => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);

  // Clean up listener on connection close
  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
