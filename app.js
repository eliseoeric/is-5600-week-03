const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const PORT = process.env.PORT || 3000;
const chatEvents = new EventEmitter();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/chat', (req, res) => {
  const { message } = req.query;
  if (message) chatEvents.emit('message', message);
  res.end();
});

app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const sendMessage = msg => res.write(`data: ${msg}\n\n`);
  chatEvents.on('message', sendMessage);

  req.on('close', () => {
    chatEvents.off('message', sendMessage);
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
