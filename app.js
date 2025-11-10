// app.js
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

// Serve static files from the public folder
app.use(express.static(__dirname + '/public'));

// --------------------
// Listener functions
// --------------------
function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
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

function respondNotFound(req, res) {
  res.status(404).send('Not Found');
}

function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

function respondChat(req, res) {
  const { message } = req.query;
  if (message) chatEmitter.emit('message', message);
  res.end();
}

function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = (message) => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);

  res.on('close', () => chatEmitter.off('message', onMessage));
}

// --------------------
// Routes
// --------------------
app.get('/', chatApp);       // serve chat.html
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// Catch-all 404
app.use(respondNotFound);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
