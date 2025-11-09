'use strict';

const path = require('path');
const express = require('express');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

// serve /public (for chat.js)
app.use(express.static(path.join(__dirname, 'public')));

/** Plain text (optional demo) */
function respondText(req, res) {
  res.type('text').send('hi');
}

/** JSON demo */
function respondJson(req, res) {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
}

/** /echo?input=... */
function respondEcho(req, res) {
  const input = (req.query.input || '').toString();
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

/** chat UI at "/" */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

/** accept chat messages */
function respondChat(req, res) {
  const message = (req.query.message || '').toString().trim();
  if (!message) return res.status(400).end();
  chatEmitter.emit('message', message);
  res.status(204).end();
}

/** SSE stream */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const onMessage = (msg) => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);

  req.on('close', () => chatEmitter.off('message', onMessage));
}

// routes
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// optional parity route
app.get('/text', respondText);

// 404
app.use((req, res) => res.status(404).type('text').send('Not Found'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
