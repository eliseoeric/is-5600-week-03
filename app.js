// app.js – Final chat application
const express = require('express');
const path = require('path');
const EventEmitter = require('events');
const port = process.env.PORT || 3000;

const app = express();
const chatEmitter = new EventEmitter();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the chat.html file at the root
function chatApp(req, res) {
    res.sendFile(path.join(__dirname, 'chat.html'));
}
app.get('/', chatApp);

// Handle incoming chat messages
function respondChat(req, res) {
    const { message } = req.query;
    if (message) {
        chatEmitter.emit('message', message);
    }
    res.end();
}
app.get('/chat', respondChat);

// Server-Sent Events endpoint for broadcasting messages
function respondSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    
    const onMessage = (message) => res.write(`data: ${message}\n\n`);
    chatEmitter.on('message', onMessage);
    
    // Clean up when client disconnects
    res.on('close', () => {
        chatEmitter.off('message', onMessage);
    });
}
app.get('/sse', respondSSE);

// Start the server
app.listen(port, () => {
    console.log(`Chat server listening on port ${port}`);
});