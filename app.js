const express = require('express');
const path = require('path');
const EventEmitter = require('events'); // 👈 Required for SSE

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter(); // 👈 Handles chat broadcasts

app.use(express.static(__dirname + '/public'));

// 1. Serve chat.html on /
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

// 2. Return plain text
function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

// 3. Return JSON
function respondJson(req, res) {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
}

// 4. Echo transformation
function respondEcho(req, res) {
  const { input = '' } = req.query;

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join('')
  });
}

// 5. Handle chat messages
function respondChat(req, res) {
  const { message } = req.query;
  chatEmitter.emit('message', message);
  res.end();
}

// 6. SSE for live messages
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = message => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// 7. 404 Handler
function respondNotFound(req, res) {
  res.status(404).send('Not Found');
}

// ✅ ROUTES
app.get('/', chatApp);
app.get('/text', respondText); // optional, not required in final version
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);
app.use(respondNotFound);

// ✅ START SERVER
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
