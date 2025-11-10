const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const clients = new Set();

const broadcast = (msg) => {
  for (const res of clients) {
    res.write(`data: ${msg}\n\n`);
  }
};

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'chat.html'));
});

app.get('/chat', (req, res) => {
  const message = (req.query.message || '').toString().trim();
  if (message.length > 0) {
    broadcast(message);
  }
  res.status(204).end();
});

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders?.();
  clients.add(res);
  res.write(`data: Connected\n\n`);
  const heartbeat = setInterval(() => {
    res.write(`: ping\n\n`);
  }, 15000);
  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
