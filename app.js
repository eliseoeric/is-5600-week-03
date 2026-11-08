const express = require('express');
const path = require('path');
const EventEmitter = require('events');
const chatEmitter = new EventEmitter();
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/json', (req, res) => {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
});

app.get('/echo', (req, res) => {
  const input = typeof req.query.input === 'string' ? req.query.input : '';

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: [...input].reverse().join('')
  });
});
app.get('/chat', (req, res) => {
  const message = req.query.message;

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).send('Enter a message.');
  }

  chatEmitter.emit('message', message.trim());
  res.set('Cache-Control', 'no-store').status(204).end();
});

app.get('/sse', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });
  res.flushHeaders();

  const sendMessage = (message) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  };

  chatEmitter.on('message', sendMessage);
  res.on('close', () => {
    chatEmitter.off('message', sendMessage);
  });
});
app.use((req, res) => {
  res.status(404).type('text/plain').send('Not Found');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});