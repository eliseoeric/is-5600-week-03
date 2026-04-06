// server.js - HTTP server with routing

const http = require('http');

const PORT = 3000;

// Sample data
const users = [
    { id: 1, name: 'sath', email: 'sath@gmail.com' },
    { id: 2, name: 'gaays', email: 'gaays@gmail.com' },
    { id: 3, name: 'Chaitu', email: 'chaitu@gmail.com' }
];

const messages = [
    { id: 1, user: 'sath', message: 'Hello everyone!', timestamp: '2024-01-01T10:00:00Z' },
    { id: 2, user: 'gaays', message: 'Hi sath!', timestamp: '2024-01-01T10:05:00Z' }
];

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
}

// Helper function to send error response
function sendError(res, statusCode, message) {
    sendJSON(res, statusCode, { error: message });
}

// Parse URL and query parameters
function parseUrl(url) {
    const urlParts = url.split('?');
    const pathname = urlParts[0];
    const params = {};
    
    if (urlParts[1]) {
        urlParts[1].split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
        });
    }
    
    return { pathname, params };
}

// Create the server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    const { pathname, params } = parseUrl(req.url);
    
    // Route: GET /
    if (req.method === 'GET' && pathname === '/') {
        sendJSON(res, 200, {
            message: 'Welcome to the NodeJS API',
            endpoints: [
                'GET / - Welcome message',
                'GET /users - Get all users',
                'GET /users?id=1 - Get user by ID',
                'GET /messages - Get all messages',
                'POST /messages - Add a new message',
                'GET /health - Health check'
            ]
        });
    }
    
    // Route: GET /health
    else if (req.method === 'GET' && pathname === '/health') {
        sendJSON(res, 200, {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }
    
    // Route: GET /users
    else if (req.method === 'GET' && pathname === '/users') {
        // Check if specific user requested
        if (params.id) {
            const userId = parseInt(params.id);
            const user = users.find(u => u.id === userId);
            
            if (user) {
                sendJSON(res, 200, user);
            } else {
                sendError(res, 404, `User with id ${userId} not found`);
            }
        } else {
            sendJSON(res, 200, users);
        }
    }
    
    // Route: GET /messages
    else if (req.method === 'GET' && pathname === '/messages') {
        sendJSON(res, 200, messages);
    }
    
    // Route: POST /messages
    else if (req.method === 'POST' && pathname === '/messages') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const newMessage = JSON.parse(body);
                
                // Validate required fields
                if (!newMessage.user || !newMessage.message) {
                    sendError(res, 400, 'Missing required fields: user, message');
                    return;
                }
                
                // Create new message
                const message = {
                    id: messages.length + 1,
                    user: newMessage.user,
                    message: newMessage.message,
                    timestamp: new Date().toISOString()
                };
                
                messages.push(message);
                sendJSON(res, 201, message);
                
            } catch (error) {
                sendError(res, 400, 'Invalid JSON format');
            }
        });
    }
    
    // Route: Not found
    else {
        sendError(res, 404, `Route ${req.method} ${pathname} not found`);
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}/`);
    console.log('\nAvailable endpoints:');
    console.log('  GET  /           - Welcome message');
    console.log('  GET  /health     - Health check');
    console.log('  GET  /users      - Get all users');
    console.log('  GET  /users?id=1 - Get user by ID');
    console.log('  GET  /messages   - Get all messages');
    console.log('  POST /messages   - Add a new message');
    console.log('\nPress Ctrl+C to stop\n');
});