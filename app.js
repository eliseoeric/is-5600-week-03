const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

let messages = [];

// GET messages
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// POST message
app.post('/api/messages', (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message required' });
  }

  const newMessage = {
    id: Date.now(),
    text: message
  };

  messages.push(newMessage);

  res.json({ success: true });
});

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});