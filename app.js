
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Store connected chat clients
const clients = [];

// Serve files from the public folder
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
    res.sendFile('chat.html', { root: __dirname });
});

// JSON route
app.get('/json', (req, res) => {
    res.json({
        text: 'hi',
        numbers: [1, 2, 3]
    });
});

// Echo route
app.get('/echo', (req, res) => {
    const input = req.query.input || '';

    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        charCount: input.length,
        backwards: input.split('').reverse().join('')
    });
});

// Display the chat page
app.get('/chat', (req, res) => {
    // Send a chat message if one was provided
    if (typeof req.query.message === 'string') {
        const message = req.query.message.trim();

        if (message) {
            clients.forEach(client => {
                client.write(`data: ${JSON.stringify(message)}\n\n`);
            });
        }

        return res.sendStatus(200);
    }

    res.sendFile('chat.html', { root: __dirname });
});

// Server-Sent Events connection
app.get('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders();

    clients.push(res);

    req.on('close', () => {
        const index = clients.indexOf(res);

        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Start Express server
app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});
