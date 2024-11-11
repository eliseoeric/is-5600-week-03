const http = require('http');
const url = require('url');
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

//Responds with plain text
function respondText(req, res) {
    res.end('hi');
}

//Responds with JSON
function respondJson(req, res) {
    res.json({
    text: 'hi',
    number: [
        1,2,3
    ]
  });
}

//Responds with a 404 not found
function respondNotFound(req, res) {
    res.writeHead(404, 'Not found', { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}

//Responds with the input string in various formats
function respondEcho(req, res) {
    const { input = '' } = req.query;

    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        charCount: input.length,
        backwards: input.split('').reverse().join(''),
    });
}

//Serves up the chat.html file
function chatApp(req, res) {
    res.sendFile(path.join(__dirname, '/chat.html'));
}

//  This endpoint will receive a message and broadcast it to all connected clients
function respondChat(req, res) {
    const { message } = req.query;
  
    chatEmitter.emit('message', message);
    res.end();
}

//This endpoint will respond to the client with a stream of server sent events
function respondSSE(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
});

  const onMessage = message => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);
  res.on('close', () => {
      chatEmitter.off('message', onMessage);
  })
}

const app = express();
app.use(express.static(__dirname + '/public'));
app.get('/', chatApp);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.listen(port, function() {
  console.log(`Server is listening on port ${port}`);
})