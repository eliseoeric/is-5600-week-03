const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const chatEmitter = new EventEmitter();
const port = process.env.PORT || 3000;


const app = express();
app.use(express.static(__dirname + '/public')); 


//  function declarations 

function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

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
function respondNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}


 // Serves up the chat.html file

function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

function respondChat(req, res) {
  const { message } = req.query;

  chatEmitter.emit('message', message);
  res.end();
}

/**
 * This endpoint will respond to the client with a stream of server sent events
 */
function respondSSE(req, res) {
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



// Express routes

// app.get('/', respondText);
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);

app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});




//  Created server using inbuilt http module


// const http = require('http');
// const url = require('url');

// const port = process.env.PORT || 3000;

// 
//  Responds with plain text
//  
// function respondText(req, res) {
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('hi');
// }

// 
//  Responds with JSON
//  
// function respondJson(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   res.end(JSON.stringify({ text: 'hi', numbers: [1, 2, 3] }));
// }

// 
//  Responds with a 404 not found
//  
// function respondNotFound(req, res) {
//   res.writeHead(404, { 'Content-Type': 'text/plain' });
//   res.end('Not Found');
// }

// 
//  Responds with the input string in various formats
//  
// function respondEcho(req, res) {
//   const urlObj = new URL(req.url, `http://${req.headers.host}`);
//   const input = urlObj.searchParams.get('input') || '';

//   res.setHeader('Content-Type', 'application/json');
//   res.end(JSON.stringify({
//     normal: input,
//     shouty: input.toUpperCase(),
//     charCount: input.length,
//     backwards: input.split('').reverse().join(''),
//   }));
// }

// Creating a server

// const server = http.createServer(function(request, response) {
//   const parsedUrl = url.parse(request.url, true);
//   const pathname = parsedUrl.pathname;

//   Server Responding to different url's 
//   console.log("url", pathname);
//   if (pathname === '/') return respondText(request, response);
//   if (pathname === '/json') return respondJson(request, response);
//   if (pathname.match(/^\/echo/)) return respondEcho(request, response);

//   respondNotFound(request, response);
// });


// Setting up the port of server

// server.listen(port, function() {
//   console.log(`Server is listening on port ${port}`);
// });