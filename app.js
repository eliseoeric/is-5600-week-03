// Import Express
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Array to store chat messages
let messages = [];

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my Chat API!' });
});

// API route
app.get('/api', (req, res) => {
  res.json({ data: 'This is data from the API endpoint.' });
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

// Post a new message
app.post('/messages', (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ error: 'Please provide user and text' });
  }
  messages.push({ user, text });
  res.status(201).json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
