const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();

// serve /public (for chat.js later)
app.use(express.static(path.join(__dirname, 'public')));

// plain text
function respondText(req, res) {
  res.send('hi');
}

// json
function respondJson(req, res) {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
}

// echo
function respondEcho(req, res) {
  const { input = '' } = req.query;

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

// chat html
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

// chat emitter
const chatEmitter = new EventEmitter();

// send from client → broadcast
function respondChat(req, res) {
  const { message } = req.query;
  chatEmitter.emit('message', message);
  res.end();
}

// stream events to browser
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const send = msg => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', send);

  res.on('close', () => chatEmitter.off('message', send));
}

// ROUTES
app.get('/', chatApp); // IMPORTANT: '/' now shows chat app
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// start server
app.listen(port, () => console.log(`Listening on port ${port}`));
