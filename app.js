// server.js
const express = require('express');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

let messages = []; // Array to store chat messages

// Route for greeting message (GET /api/greeting)
app.get('/api/greeting', (req, res) => {
  res.json({ message: 'Hello, welcome to the NodeJS API using Express!' });
});

// Route to get all chat messages (GET /api/messages)
app.get('/api/messages', (req, res) => {
  res.json(messages);  // Return all chat messages
});

// Route to post a new chat message (POST /api/messages)
app.post('/api/messages', (req, res) => {
  const { username, message } = req.body;

  // Check if both username and message are provided
  if (!username || !message) {
    return res.status(400).json({ error: 'Username and message are required' });
  }

  // Create a new message object
  const newMessage = {
    username: username,
    message: message,
    timestamp: new Date().toISOString()  // Include timestamp for each message
  };

  // Add the new message to the array
  messages.push(newMessage);

  // Send the newly created message back to the client
  res.status(201).json(newMessage);
});

// Handle all other routes with a 404 error (for undefined routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(3000, () => {
  console.log('Chat server running on http://localhost:3000');
});
