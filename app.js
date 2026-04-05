const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Home Route' });
});

app.get('/about', (req, res) => {
  res.json({ message: 'About Route' });
});

app.get('/chat', (req, res) => {
  const messages = [
    {
      id: 1,
      user: 'Alice',
      message: 'Welcome to the chat!',
      timestamp: '2026-04-05T12:00:00Z',
    },
    {
      id: 2,
      user: 'Bob',
      message: 'Hi Alice, how are you?',
      timestamp: '2026-04-05T12:01:30Z',
    },
    {
      id: 3,
      user: 'Alice',
      message: 'I am good, thanks! Ready to learn Express.',
      timestamp: '2026-04-05T12:02:15Z',
    },
  ];
  res.json(messages);
});

app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
