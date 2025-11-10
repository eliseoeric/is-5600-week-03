const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = express();
const chatEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, 'public')));

function respondText(req, res) {
  res.type('text').send('hi');
}


function respondJson(req, res) {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
}


function respondEcho(req, res) {
  const input = (req.query.input || '').toString();
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}


function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}


app.get('/', chatApp);       
app.get('/json', respondJson);
app.get('/echo', respondEcho);


app.get('/chat', (req, res) => {
  const { message = '' } = req.query;
  chatEmitter.emit('message', message);
  res.end();
});

app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });


  res.write('data: connected\n\n');

  const onMessage = (msg) => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);

  req.on('close', () => chatEmitter.off('message', onMessage));
});


app.use((req, res) => res.status(404).type('text').send('Not Found'));

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
