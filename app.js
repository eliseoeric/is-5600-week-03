const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;

const app = express();
const chatEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Responds with plain text
 * 
 * @param {object} req
 * @param {object} res
 */
function respondText(req, res) {
  res.type('text/plain');
  res.send('hi');
}

/**
 * Responds with JSON
 * 
 * @param {object} req
 * @param {object} res
 */
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

/**
 * Responds with a 404 not found
 * 
 * @param {object} req
 * @param {object} res
 */
function respondNotFound(req, res) {
  res.status(404).type('text/plain').send('Not Found');
}

/**
 * Responds with the input string in various formats
 * 
 * @param {object} req
 * @param {object} res
 */
function respondEcho(req, res) {
  const { input = '' } = req.query;

  res.json({
    normal: input,
    shout: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

/**
 * Serves the chat application page
 * 
 * @param {object} req
 * @param {object} res
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

/**
 * Receives chat messages and emits them
 * 
 * @param {object} req
 * @param {object} res
 */
function respondChat(req, res) {
  const { message = '' } = req.query;

  chatEmitter.emit('message', message);
  res.end();
}

/**
 * Sends server sent events to connected clients
 * 
 * @param {object} req
 * @param {object} res
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  });

  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.use(respondNotFound);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});