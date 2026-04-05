// app.js
// Lab 03 – Node API with Express (Full start-to-end example)

const express = require('express'); // Import Express
const app = express();               // Create Express app

const PORT = 3000;                   // Server port

// Middleware
// Parse incoming JSON in POST requests
app.use(express.json());

// ===== ROUTES =====

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

// About route
app.get('/about', (req, res) => {
  res.json({ message: 'About this API' });
});

// ===== In-memory chat storage =====
let messages = [];

// Get all chat messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Add a new chat message
app.post('/messages', (req, res) => {
  const { message } = req.body;

  // Validate input
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Create message object
  const newMessage = {
    id: messages.length + 1,
    text: message,
    timestamp: new Date()
  };

  messages.push(newMessage); // Save message

  res.status(201).json(newMessage);
});

// Delete all messages (optional)
app.delete('/messages', (req, res) => {
  messages = [];
  res.json({ message: 'All messages deleted' });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});