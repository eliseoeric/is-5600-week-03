const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Home Route' });
});

app.get('/about', (req, res) => {
  res.json({ message: 'About Route' });
});

app.get('/chat', (req, res) => {
  const messages = [
    { id: 1, user: 'Alice', message: 'Hello everyone!', timestamp: '2024-01-01T10:00:00Z' },
    { id: 2, user: 'Bob', message: 'Hi Alice! How are you?', timestamp: '2024-01-01T10:01:00Z' },
    { id: 3, user: 'Charlie', message: 'Welcome to the chat!', timestamp: '2024-01-01T10:02:00Z' }
  ];

  res.json(messages);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: '404 Not Found' });
});

app.listen(port, () => {
  console.log(`Express Server running on port ${port}`);
});