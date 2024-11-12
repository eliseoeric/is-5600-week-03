const path = require('path');
const express = require('express');
const EventEmitter = require('events');
const chatEmitter = new EventEmitter();

const port = process.env.PORT || 3000;
const app = express();
app.use(express.static(path.join(__dirname, '/public')));

/**
 * Serves the chat.html file
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function chatApp(req, res) {
    res.sendFile(path.join(__dirname, 'chat.html'));
}

/**
 * Responds with plain text
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondText(req, res) {
    res.type('text').send('hi');
}

/**
 * Responds with JSON
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondJson(req, res) {
    res.json({ text: 'hi', numbers: [1, 2, 3] });
}

/**
 * Responds with the input string in various formats
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondEcho(req, res) {
    const { input = '' } = req.query;
    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        charCount: input.length,
        backwards: input.split('').reverse().join(''),
    });
}

/**
 * Endpoint to handle chat messages
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondChat(req, res) {
    const { message } = req.query;
    chatEmitter.emit('message', message);
    res.end();
}

/**
 * Server-Sent Events (SSE) endpoint
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
    });

    const onMessage = (message) => res.write(`data: ${message}\n\n`);
    chatEmitter.on('message', onMessage);

    res.on('close', () => {
        chatEmitter.off('message', onMessage);
    });
}

// Route bindings
app.get('/chat', chatApp);          // Serves chat.html
app.get('/json', respondJson);       // JSON response
app.get('/echo', respondEcho);       // Echo response
app.get('/sse', respondSSE);         // SSE stream
app.get('/send', respondChat);       // Chat message handler
app.use((req, res) => res.status(404).type('text').send('Not Found')); // 404 handler

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
