// Required modules
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Event Emitter for chat messages
const chatEmitter = new EventEmitter();

// static files (e.g., chat.js, chat.css)
app.use(express.static(__dirname + '/public'));

// Function to serve the chat.html file
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

// Respond with plain text
function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

// Respond with JSON
function respondJson(req, res) {
  // Using express's built-in JSON method
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

// Respond with echo of input in various formats
function respondEcho(req, res) {
  // Get query parameter input
  const { input = '' } = req.query;

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

// Respond to chat messages (handle incoming message)
function respondChat(req, res) {
  const { message } = req.query;

  // Emit the chat message to all connected clients
  chatEmitter.emit('message', message);
  res.end();
}

// Respond to server-sent events (SSE) for chat messages
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  // Set up message listener
  const onMessage = message => res.write(`data: ${message}\n\n`);

  // Listen to chatEmitter for new messages
  chatEmitter.on('message', onMessage);

  // Cleanup when the client disconnects
  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// Define routes
app.get('/', chatApp); // Serve the chat app HTML
app.get('/json', respondJson); // Return JSON
app.get('/echo', respondEcho); // Echo route
app.get('/chat', respondChat); // Handle chat messages
app.get('/sse', respondSSE); // Server-Sent Events for live chat updates

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});