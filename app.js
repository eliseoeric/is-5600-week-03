// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();

// Create an instance of EventEmitter
const chatEmitter = new EventEmitter();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Responds with plain text
 */
function respondText(req, res) {
  res.type('text').send('hi');
}

/**
 * Responds with JSON
 */
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3]
  });
}

/**
 * Responds with the input string in various formats
 */
function respondEcho(req, res) {
  const input = req.query.input || '';

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join('')
  });
}

/**
 * Serves up the chat.html file
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

/**
 * Handles chat messages sent via the /chat endpoint
 */
function respondChat(req, res) {
  const { message } = req.query;
  
  if (message) {
    chatEmitter.emit('message', message);
    res.status(200).end();
  } else {
    res.status(400).send('Bad Request: No message provided');
  }
}

/**
 * Handles Server-Sent Events at the /sse endpoint
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  // Function to send messages to the client
  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  // Listen for 'message' events
  chatEmitter.on('message', onMessage);

  // Remove the listener when the connection is closed
  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

/**
 * Responds with a 404 not found
 */
function respondNotFound(req, res) {
  res.status(404).type('text').send('Not Found');
}

// Define routes
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// Handle undefined routes
app.use(respondNotFound);

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


