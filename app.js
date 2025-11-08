// Lab 03 — Node API per instructions (Express + simple chat)

const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();

// ---------- Demo API routes from the lab ----------
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
    backwards: input.split('').reverse().join(''),
  });
}

// Serve the chat UI at "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// Serve static assets from /public (chat.js, css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Bind the demo routes
app.get('/text', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);

// ---------- Minimal chat (EventSource + fetch) ----------
const chatEmitter = new EventEmitter();

// Send a message (GET /chat?message=...)
app.get('/chat', (req, res) => {
  const { message = '' } = req.query;
  chatEmitter.emit('message', message);
  res.end();
});

// Server-Sent Events stream (clients subscribe here)
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const onMessage = (msg) => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
