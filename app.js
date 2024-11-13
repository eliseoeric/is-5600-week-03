const express = require('express');
const path = require('path');
const EventEmitter = require('events');

// Set port and create an event emitter for real-time messages
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

const app = express();

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Simple text response
app.get('/text', (req, res) => {
    res.send('Hi there!');
});

// JSON response with sample data
app.get('/json', (req, res) => {
    res.json({
        text: 'Hello!',
        numbers: [1, 2, 3, 4],
    });
});

// Echo endpoint that returns variations of input text
app.get('/echo', (req, res) => {
    const { input = '' } = req.query;
    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        charCount: input.length,
        backwards: input.split('').reverse().join(''),
    });
});

// Endpoint to receive chat messages and emit them
app.get('/chat', (req, res) => {
    const { message } = req.query;
    chatEmitter.emit('message', message); // Broadcasts message to listeners
    res.end();
});

// Server-Sent Events (SSE) setup for real-time chat updates
app.get('/sse', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
    });

    const onMessage = (message) => res.write(`data: ${message}\n\n`); // Send incoming messages as events
    chatEmitter.on('message', onMessage);

    res.on('close', () => {
      chatEmitter.off('message', onMessage); // Remove listener when client disconnects
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
