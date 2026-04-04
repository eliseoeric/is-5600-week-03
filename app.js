const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const messages = [
  { id: 1, text: 'Hello from the API' },
  { id: 2, text: 'This is a message list' },
];

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to API' });
});

app.get('/about', (req, res) => {
  res.json({ message: 'About Page' });
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { text } = req.body;

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const newMessage = {
    id: messages.length + 1,
    text: text.trim(),
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
