const express = require('express');
const app = express();
app.use(express.json());

let messages = [];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express API!' });
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ error: 'User and text are required' });
  }
  const newMessage = { id: messages.length + 1, user, text };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
