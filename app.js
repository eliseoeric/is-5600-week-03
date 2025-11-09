const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.static(__dirname + '/public'));

const chatEmitter = new EventEmitter();

/** plain text */
function respondText(req, res) {
  res.send("hi");
}

/** json */
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

/** echo */
function respondEcho(req, res) {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

/** serve chat.html */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

/** chat endpoint */
function respondChat(req, res) {
  const { message } = req.query;
  chatEmitter.emit('message', message);
  res.end();
}

/** SSE endpoint */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = msg => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);

  res.on('close', () => chatEmitter.off('message', onMessage));
}

/* ROUTES */
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
