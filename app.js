const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

function respondText(req, res) {
    res.end('hi');
  }

function respondJson(req, res) {
    res.json({ text: 'hi', numbers: [1, 2, 3] });
  }

function respondNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
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
  })
}

const app = express();
app.use(express.static(__dirname + '/public'));
app.get('/', chatApp);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

/*
// note that typically the variables here are `req` and `res` but we are using `request` and `response` for clarity
const server = http.createServer(function(request, response) {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    console.log("url", pathname);

    if (pathname === '/') return respondText(request, response);
    if (pathname === '/json') return respondJson(request, response);
    if (pathname.match(/^\/echo/)) return respondEcho(request, response);

  respondNotFound(request, response);
});

// Handle EADDRINUSE error and retry
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is in use, retrying...`);
      setTimeout(() => {
          server.close();
          server.listen(port);
      }, 1000); // Retry after 1 second
  } else {
      console.error(`Server error: ${err}`);
  }
});
*/

/*app.listen(port, () => {
  console.log(`Listening on port ${port}`);
}); */

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
}) 
