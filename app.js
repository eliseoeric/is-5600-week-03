const express = require('express');
const path = require('path');
const EventEmitter = require('events'); // For chat messages
const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter(); // For Server-Sent Events (SSE)

// Serve static files from public folder
app.use(express.static(__dirname + '/public'));
// Text response
function respondText(req, res) {
    res.send('hi');
  }
  
  // JSON response
  function respondJson(req, res) {
    res.json({ text: 'hi', numbers: [1, 2, 3] });
  }
  
  // Echo response
  function respondEcho(req, res) {
    const { input = '' } = req.query;
    res.json({
      normal: input,
      shouty: input.toUpperCase(),
      charCount: input.length,
      backwards: input.split('').reverse().join(''),
    });
  }
  
  // Serve chat.html
  function chatApp(req, res) {
    res.sendFile(path.join(__dirname, '/chat.html'));
  }
  
  // Handle chat messages
  function respondChat(req, res) {
    const { message } = req.query;
    chatEmitter.emit('message', message); // broadcast message to all listeners
    res.end();
  }
  
  // Server-Sent Events (SSE)
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
  app.get('/', chatApp);          // Serves chat.html
  app.get('/json', respondJson); // JSON response
  app.get('/echo', respondEcho); // Echo API
  app.get('/chat', respondChat); // Handle chat message
  app.get('/sse', respondSSE);   // Server-Sent Events
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
      