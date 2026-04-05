const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Hello, world with Express!' });
});

// Simple chat route
let messages = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ error: 'User and text are required' });
  }
  const message = { user, text, timestamp: new Date() };
  messages.push(message);
  res.status(201).json(message);
});

app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));