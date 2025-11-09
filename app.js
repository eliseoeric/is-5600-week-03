
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let messages = [];
let nextId = 1;

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', time: new Date().toISOString() });
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ error: 'user and text required' });
  }
  const msg = { id: nextId++, user, text, time: new Date().toISOString() };
  messages.push(msg);
  res.status(201).json(msg);
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
