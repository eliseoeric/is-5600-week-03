const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;

const app = express();
const chatEmitter = new EventEmitter();

// Configure static files
app.use(express.static(__dirname + '/public'));

// Keep all the previous handler functions, but modify respondJson and respondEcho:

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

/**
 * Serves up the chat.html file
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

/**
 * Handles incoming chat messages
 */
function respondChat(req, res) {
  const { message } = req.query;
  chatEmitter.emit('message', message);
  res.end();
}

/**
 * This endpoint will respond to the client with a stream of server sent events
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });

  const onMessage = message => res.write(data: ${message}\n\n);
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// Register routes
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.listen(port, () => {
  console.log(Listening on port ${port});
});