
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;

// Chat system
const chatEmitter = new EventEmitter();

// Serve static files
app.use(express.static(__dirname + '/public'));


// ==============================
// RESPONSE FUNCTIONS
// ==============================

// Serve chat UI
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

// Send message
function respondChat(req, res) {
  const message = req.query.message || '';
  chatEmitter.emit('message', message);
  res.end('ok');
}

// SSE connection
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const listener = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', listener);

  req.on('close', () => {
    chatEmitter.removeListener('message', listener);
  });
}

// 404 fallback
function respondNotFound(req, res) {
  res.status(404).send('Not Found');
}


// ==============================
// ROUTES
// ==============================

app.get('/', chatApp);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.use(respondNotFound);


// ==============================
// START SERVER
// ==============================

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});