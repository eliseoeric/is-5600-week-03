const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/chat', (req, res) => {
  const message = req.query.message || '';
  chatEmitter.emit('message', message);
  res.sendStatus(200);
});

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');

  const sendMessage = (msg) => {
    res.write(`data: ${msg}\n\n`);
  };

  chatEmitter.on('message', sendMessage);

  req.on('close', () => {
    chatEmitter.removeListener('message', sendMessage);
  });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});