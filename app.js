const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// Store connected clients
let clients = [];

// Serve static files from the 'public' directory
app.use(express.static('public'));

// SSE endpoint
app.get('/sse', (req, res) => {
  console.log('Client connected via SSE');

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Important to start the connection

  // Add the client to the list
  clients.push(res);

  // Remove client when they disconnect
  req.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter(client => client !== res);
  });
});

// Chat message endpoint
app.get('/chat', (req, res) => {
  const message = req.query.message;
  console.log('New message received:', message);

  // Send message to all connected clients
  clients.forEach(client => {
    client.write(`data: ${message}\n\n`);
  });

  // Respond with a 200 OK status
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
