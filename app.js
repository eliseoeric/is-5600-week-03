const express = require('express');
const path = require('path');
const EventEmitter = require('events');
const port = process.env.PORT || 3000;

const chatEmitter = new EventEmitter();

const app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', chatApp);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);
app.get('/json', respondJson);
app.get('/echo', respondEcho);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


/**
 * Responds with plain text
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondText(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hi');
}
  
/**
  * Responds with JSON
  * 
  * @param {http.IncomingMessage} req
  * @param {http.ServerResponse} res
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
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}

/**
 * Responds with the input string in various formats
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondEcho (req, res) {
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


function respondChat (req, res) {
    const { message } = req.query;
  
    chatEmitter.emit('message', message);
    res.end();
}
  
function respondSSE (req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
    });
  
    const onMessage = message => res.write(`data: ${message}\n\n`);
    chatEmitter.on('message', onMessage);
  
    res.on('close', () => {
      chatEmitter.off('message', onMessage);
    });
}