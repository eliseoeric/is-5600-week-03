const express = require('express');
const path = require('path');
const EventEmitter = require('events'); 

const app = express();
const port = process.env.PORT || 3000;

// Create a new instance of EventEmitter to handle chat messages
const chatEmitter = new EventEmitter();

// Serve static files from the "public" folder (for serving chat.js and other assets)
app.use(express.static(__dirname + '/public'));

// Serve the chat.html file when the user accesses the root ("/") endpoint
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}
app.get('/', chatApp);

// Define the /chat endpoint to receive messages and emit them to all connected clients
app.get('/chat', respondChat);
function respondChat(req, res) {
  const { message } = req.query;
  
  // Emit the new message to all connected clients
  chatEmitter.emit('message', message);
  res.end(); 
}

// Define the /sse endpoint to stream chat messages to the client in real-time
app.get('/sse', respondSSE);
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive', 
  });

  // Send a message to the client when a new message is emitted
  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`); 
  };

  // Listen for new messages via the chatEmitter
  chatEmitter.on('message', onMessage);

  // If the client disconnects, remove the listener for new messages
  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
