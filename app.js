const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

function respondText(req, res) {

  res.end('hi');
}

function respondJson(req, res) {
  res.json({ text: 'hi',
     numbers: [1, 2, 3] });
}

function respondNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

 function respondEcho(req, res) {
    const { input = '' } =  req.query;

    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        charCount: input.length,
        backwards: input.split('').reverse().join(''),
    });
}

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

  const onMessage = message => res.write(`data: ${message}\n\n`); // use res.write to keep the connection open, so the client is listening for new messages
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

const app = express();
app.use(express.static(__dirname + '/public'));
app.get('/',chatApp);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);


app.listen(port, function() {
  console.log(`Server is listening on port ${port}`);
});
 1,814 changes: 1,797 additions & 17 deletions1,814  
package-lock.json
Viewed
Large diffs are not rendered by default.

  2 changes: 2 additions & 0 deletions2  
package.json
Viewed
Original file line number	Diff line number	Diff line change
@@ -12,7 +12,9 @@
  "license": "ISC",
  "dependencies": {
    "@types/node": "^18.0.6",
    "express": "^5.1.0",
    "node-fetch": "^3.2.6",
    "nodemon": "^3.1.0"
  }
}
