// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, 'public')));

const respondText = (req, res) => {
  res.send('hi');
};

const respondJson = (req, res) => {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
};

const respondEcho = (req, res) => {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
};

const chatApp = (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
};

const respondChat = (req, res) => {
  const { message } = req.query;
  if (message) chatEmitter.emit('message', message);
  res.end();
};

const respondSSE = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });


  res.write(`data: Connected to chat stream\n\n`);

  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
};


app.get('/', chatApp);
app.get('/text', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
