const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'chat.html')));

app.get('/chat', (req, res) => {
    chatEmitter.emit('message', req.query.message);
    res.end();
});


app.get('/sse', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Connection': 'keep-alive' });

    const onMessage = (message) => res.write(`data: ${message}\n\n`);
    chatEmitter.on('message', onMessage);

    res.on('close', () => chatEmitter.off('message', onMessage));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
