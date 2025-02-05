const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'chat.html')));
app.get('/json', (req, res) => res.json({ text: 'hi', numbers: [1, 2, 3] }));
app.get('/echo', (req, res) => {
    const { input = '' } = req.query;
    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        charCount: input.length,
        backwards: input.split('').reverse().join(''),
    });
});
app.get('/chat', (req, res) => {
    const { message } = req.query;
    if (message) chatEmitter.emit('message', message);
    res.end();
});

// Server-Sent Events (SSE) for chat messages
app.get('/sse', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
    });

    const onMessage = (message) => res.write(`data: ${message}\n\n`);
    chatEmitter.on('message', onMessage);

    res.on('close', () => chatEmitter.off('message', onMessage));
});

// 404 handler
app.use((req, res) => res.status(404).send('Not Found'));

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
