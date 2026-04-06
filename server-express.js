// server-express.js - Express version of the API

const express = require('express');

// Create Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Sample data
const users = [
    { id: 1, name: 'sath', email: 'sath@gmail.com' },
    { id: 2, name: 'gaays', email: 'gaays@gmail.com' },
    { id: 3, name: 'chaitu', email: 'chaitu@gmail.com' }
];

let messages = [
    { id: 1, user: 'sath', message: 'Hello everyone!', timestamp: '2024-01-01T10:00:00Z' },
    { id: 2, user: 'gaays', message: 'Hi sath!', timestamp: '2024-01-01T10:05:00Z' }
];

// Routes

// GET / - Welcome message
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Express API!',
        version: '1.0.0',
        endpoints: [
            'GET  /',
            'GET  /health',
            'GET  /users',
            'GET  /users/:id',
            'GET  /messages',
            'POST /messages',
            'DELETE /messages/:id'
        ]
    });
});

// GET /health - Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// GET /users - Get all users
app.get('/users', (req, res) => {
    res.json({
        count: users.length,
        users: users
    });
});

// GET /users/:id - Get user by ID
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: `User with id ${userId} not found` });
    }
});

// GET /messages - Get all messages
app.get('/messages', (req, res) => {
    res.json({
        count: messages.length,
        messages: messages
    });
});

// POST /messages - Add a new message
app.post('/messages', (req, res) => {
    const { user, message } = req.body;
    
    // Validate required fields
    if (!user || !message) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['user', 'message']
        });
    }
    
    // Create new message
    const newMessage = {
        id: messages.length + 1,
        user: user,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    res.status(201).json(newMessage);
});

// DELETE /messages/:id - Delete a message
app.delete('/messages/:id', (req, res) => {
    const messageId = parseInt(req.params.id);
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
        const deletedMessage = messages.splice(messageIndex, 1)[0];
        res.json({
            message: 'Message deleted successfully',
            deleted: deletedMessage
        });
    } else {
        res.status(404).json({ error: `Message with id ${messageId} not found` });
    }
});

// Handle 404 - Route not found
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.url,
        method: req.method
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
    console.log('\nAvailable endpoints:');
    console.log('  GET  /                  - Welcome');
    console.log('  GET  /health            - Health check');
    console.log('  GET  /users             - All users');
    console.log('  GET  /users/:id         - User by ID');
    console.log('  GET  /messages          - All messages');
    console.log('  POST /messages          - Add message');
    console.log('  DELETE /messages/:id    - Delete message');
    console.log('\nPress Ctrl+C to stop\n');
});
