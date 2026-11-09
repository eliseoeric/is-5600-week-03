const express = require('express');
const path = require('node:path');
const EventEmitter = require('node:events');

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, 'public')));

function respondJson(req, res) {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
}

function respondEcho(req, res) {
  const { input = '' } = req.query;
  if (typeof input !== 'string') {
    return res.status(400).json({ error: 'Provide a single input value.' });
  }

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

function respondChat(req, res) {
  const { message } = req.query;
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).send('Enter a message.');
  }

  res.set('Cache-Control', 'no-store');
  chatEmitter.emit('message', message);
  res.end();
}

function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });
  res.write(': connected\n\n');

  // Prefix each line so a multiline message stays inside one SSE event.
  const onMessage = (message) => {
    const lines = message.split(/\r\n|\r|\n/);
    res.write(lines.map((line) => `data: ${line}\n`).join('') + '\n');
  };

  chatEmitter.on('message', onMessage);
  res.on('close', () => chatEmitter.off('message', onMessage));
}

app.get(['/', '/chat.html'], chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.use((req, res) => res.status(404).type('text/plain').send('Not Found'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
