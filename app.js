// app.js

const express = require('express');
const path = require('path');
const { EventEmitter } = require('events');

const port = process.env.PORT || 3000;
const app = express();
const chatEvents = new EventEmitter();

// Serve static files
app.use(express.static(__dirname + '/public'));

// ---------- HANDLERS ----------

// Plain text "hi"
function sendHi(req, res) {
  res.type('text/plain').send('hi');
}

// JSON response
function sendJson(req, res) {
  res.json({
    text: 'hi',
    items: [10, 20, 30],
  });
}

// Echo endpoint
function sendEcho(req, res) {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    length: input.length,
    reversed: input.split('').reverse().join(''),
  });
}

// Serve chat page
function serveChat(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

// Chat message sender
function handleChat(req, res) {
  const { message } = req.query;
  if (message) {
    chatEvents.emit('msg', message);
  }
  res.end();
}

// Server-sent events
function handleSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMsg = msg => res.write(`data: ${msg}\n\n`);
  chatEvents.on('msg', onMsg);

  res.on('close', () => {
    chatEvents.off('msg', onMsg);
  });
}

// ---------- ROUTES ----------

app.get('/', serveChat);
app.get('/hi', sendHi);
app.get('/api/json', sendJson);
app.get('/api/echo', sendEcho);
app.get('/chat', handleChat);
app.get('/sse', handleSSE);

// ---------- START ----------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
