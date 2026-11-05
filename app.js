const express = require('express');
const path = require('path');
const { EventEmitter } = require('events');

const app = express();
const chatEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, 'public')));

app.get(['/', '/chat.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/echo', (req, res) => {
  const { input = '' } = req.query;

  if (typeof input !== 'string') {
    return res.status(400).json({ error: 'input must be a single string' });
  }

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join('')
  });
});

app.get('/chat', (req, res) => {
  const { message } = req.query;

  if (typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'message is required' });
  }

  chatEmitter.emit('message', message);
  res.sendStatus(204);
});

app.get('/sse', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders();

  const onMessage = message => {
    for (const line of message.split(/\r?\n/)) {
      res.write(`data: ${line}\n`);
    }
    res.write('\n');
  };

  chatEmitter.on('message', onMessage);
  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Chat app listening on port ${port}`);
});
