const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, 'public')));

function respondText(req, res) {
  res.type('text').send('hi');
}

function respondJson(req, res) {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
}

function respondEcho(req, res) {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join('')
  });
}

function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

function respondChat(req, res) {
  const { message = '' } = req.query;
  if (message.trim()) {
    chatEmitter.emit('message', message.trim());
  }
  res.end();
}

function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  const onMessage = message => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);
app.get('/text', respondText);

app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
