const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

app.use(express.static(__dirname + '/public'));

app.get('/text', (req, res) => res.end('hi'));

app.get('/json', (req, res) => res.json({ text: 'hi', numbers: [1, 2, 3] }));

app.get('/echo', (req, res) => {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
});

app.get('/chat', (req, res) => {
  chatEmitter.emit('message', req.query.message);
  res.end();
});

app.get('/sse', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Connection': 'keep-alive' });
  const onMessage = msg => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);
  res.on('close', () => chatEmitter.off('message', onMessage));
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/chat.html')));

app.listen(port, () => console.log(`Listening on port ${port}`));