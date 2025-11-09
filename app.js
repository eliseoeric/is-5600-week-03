const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

// Serve the public folder so chat.js loads
app.use(express.static(__dirname + '/public'));

// Plain text response
function respondText(req, res) {
  res.send('hi');
}

// JSON response
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3]
  });
}

// Echo dynamic text response
function respondEcho (req, res) {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

// Serve the chat HTML page
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

// Send messages to all connected clients
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = message => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);

  res.on('close', () => chatEmitter.off('message', onMessage));
}

// Receive messages from the chat box
function respondChat(req, res) {
  const { message } = req.query;
  chatEmitter.emit('message', message);
  res.end();
}

// ROUTES
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
