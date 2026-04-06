// chat-app.js - Simple chat application with Express

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files (for optional HTML frontend)

// Store chat messages
let chatMessages = [
    {
        id: 1,
        username: 'System',
        message: 'Welcome to the chat!',
        timestamp: new Date().toISOString(),
        room: 'general'
    }
];

let nextId = 2;

// Store active users (simple in-memory)
let activeUsers = new Set();

// Routes

// GET /chat - Get all chat messages
app.get('/chat', (req, res) => {
    const room = req.query.room || 'general';
    const roomMessages = chatMessages.filter(m => m.room === room);
    
    res.json({
        room: room,
        count: roomMessages.length,
        messages: roomMessages
    });
});

// GET /chat/messages - Get recent messages (limit parameter)
app.get('/chat/messages', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const room = req.query.room || 'general';
    
    const roomMessages = chatMessages.filter(m => m.room === room);
    const recentMessages = roomMessages.slice(-limit);
    
    res.json({
        room: room,
        limit: limit,
        total: roomMessages.length,
        messages: recentMessages
    });
});

// GET /chat/messages/:id - Get specific message
app.get('/chat/messages/:id', (req, res) => {
    const messageId = parseInt(req.params.id);
    const message = chatMessages.find(m => m.id === messageId);
    
    if (message) {
        res.json(message);
    } else {
        res.status(404).json({ error: `Message with id ${messageId} not found` });
    }
});

// POST /chat/messages - Send a new message
app.post('/chat/messages', (req, res) => {
    const { username, message, room } = req.body;
    
    // Validate required fields
    if (!username || !message) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['username', 'message'],
            optional: ['room']
        });
    }
    
    // Add user to active users
    activeUsers.add(username);
    
    // Create new message
    const newMessage = {
        id: nextId++,
        username: username,
        message: message,
        timestamp: new Date().toISOString(),
        room: room || 'general'
    };
    
    chatMessages.push(newMessage);
    
    // Keep only last 1000 messages to prevent memory issues
    if (chatMessages.length > 1000) {
        chatMessages = chatMessages.slice(-1000);
    }
    
    res.status(201).json(newMessage);
});

// DELETE /chat/messages/:id - Delete a message (admin only in this simple version)
app.delete('/chat/messages/:id', (req, res) => {
    const messageId = parseInt(req.params.id);
    const messageIndex = chatMessages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
        const deletedMessage = chatMessages.splice(messageIndex, 1)[0];
        res.json({
            message: 'Message deleted successfully',
            deleted: deletedMessage
        });
    } else {
        res.status(404).json({ error: `Message with id ${messageId} not found` });
    }
});

// GET /chat/users - Get active users
app.get('/chat/users', (req, res) => {
    const room = req.query.room || 'general';
    
    // In a real app, you'd track users per room
    // For this simple version, return all active users
    res.json({
        room: room,
        activeUsers: Array.from(activeUsers),
        count: activeUsers.size
    });
});

// GET /chat/rooms - Get available rooms
app.get('/chat/rooms', (req, res) => {
    const rooms = ['general', 'random', 'technology', 'help'];
    res.json({ rooms: rooms });
});

// POST /chat/clear - Clear all messages (for testing)
app.post('/chat/clear', (req, res) => {
    const { secret } = req.body;
    
    // Simple secret to prevent accidental clears
    if (secret === 'clear123') {
        const clearedCount = chatMessages.length;
        chatMessages = [{
            id: nextId++,
            username: 'System',
            message: 'Chat history cleared',
            timestamp: new Date().toISOString(),
            room: 'general'
        }];
        
        res.json({
            message: 'Chat history cleared',
            clearedCount: clearedCount
        });
    } else {
        res.status(403).json({ error: 'Invalid secret' });
    }
});

// GET /chat/stats - Get chat statistics
app.get('/chat/stats', (req, res) => {
    const totalMessages = chatMessages.length;
    const uniqueUsers = [...new Set(chatMessages.map(m => m.username))];
    const messagesByUser = {};
    
    chatMessages.forEach(m => {
        messagesByUser[m.username] = (messagesByUser[m.username] || 0) + 1;
    });
    
    res.json({
        totalMessages: totalMessages,
        uniqueUsers: uniqueUsers.length,
        users: uniqueUsers,
        messagesPerUser: messagesByUser,
        activeUsers: activeUsers.size,
        timestamp: new Date().toISOString()
    });
});

// Simple HTML frontend route
app.get('/chat-ui', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Simple Chat</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .chat-container {
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .messages {
                    height: 400px;
                    overflow-y: auto;
                    padding: 20px;
                    border-bottom: 1px solid #ddd;
                }
                .message {
                    margin-bottom: 15px;
                    padding: 10px;
                    border-radius: 8px;
                    background-color: #e3f2fd;
                }
                .message strong {
                    color: #1976d2;
                }
                .message .time {
                    font-size: 0.8em;
                    color: #666;
                    margin-left: 10px;
                }
                .input-area {
                    padding: 20px;
                    display: flex;
                    gap: 10px;
                }
                input, button {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                input {
                    flex: 1;
                }
                button {
                    background-color: #1976d2;
                    color: white;
                    cursor: pointer;
                    border: none;
                }
                button:hover {
                    background-color: #1565c0;
                }
                .username-area {
                    padding: 20px;
                    background-color: #f9f9f9;
                    display: flex;
                    gap: 10px;
                    border-bottom: 1px solid #ddd;
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                .stats {
                    padding: 10px 20px;
                    background-color: #e8e8e8;
                    font-size: 0.9em;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>💬 Simple Chat Application</h1>
            <div class="chat-container">
                <div class="username-area">
                    <input type="text" id="username" placeholder="Enter your username" value="Guest">
                    <button onclick="setUsername()">Join Chat</button>
                </div>
                <div class="messages" id="messages">
                    <div class="message"><strong>System:</strong> Enter a username to start chatting!</div>
                </div>
                <div class="input-area">
                    <input type="text" id="messageInput" placeholder="Type your message..." disabled>
                    <button onclick="sendMessage()" id="sendBtn" disabled>Send</button>
                </div>
                <div class="stats" id="stats">Loading stats...</div>
            </div>

            <script>
                let currentUsername = '';
                let refreshInterval;
                
                async function setUsername() {
                    const username = document.getElementById('username').value.trim();
                    if (!username) {
                        alert('Please enter a username');
                        return;
                    }
                    currentUsername = username;
                    
                    document.getElementById('username').disabled = true;
                    document.getElementById('messageInput').disabled = false;
                    document.getElementById('sendBtn').disabled = false;
                    
                    // Load messages
                    await loadMessages();
                    
                    // Start auto-refresh every 3 seconds
                    if (refreshInterval) clearInterval(refreshInterval);
                    refreshInterval = setInterval(loadMessages, 3000);
                    
                    // Update stats
                    loadStats();
                    setInterval(loadStats, 10000);
                }
                
                async function loadMessages() {
                    try {
                        const response = await fetch('/chat/messages?limit=50');
                        const data = await response.json();
                        
                        const messagesDiv = document.getElementById('messages');
                        messagesDiv.innerHTML = data.messages.map(msg => 
                            '<div class="message">' +
                                '<strong>' + escapeHtml(msg.username) + ':</strong> ' +
                                escapeHtml(msg.message) +
                                '<span class="time">' + new Date(msg.timestamp).toLocaleTimeString() + '</span>' +
                            '</div>'
                        ).reverse().join('');
                        
                        // Auto-scroll to bottom
                        messagesDiv.scrollTop = messagesDiv.scrollHeight;
                    } catch (error) {
                        console.error('Error loading messages:', error);
                    }
                }
                
                async function sendMessage() {
                    const message = document.getElementById('messageInput').value.trim();
                    if (!message || !currentUsername) return;
                    
                    try {
                        const response = await fetch('/chat/messages', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                username: currentUsername,
                                message: message,
                                room: 'general'
                            })
                        });
                        
                        if (response.ok) {
                            document.getElementById('messageInput').value = '';
                            await loadMessages();
                        }
                    } catch (error) {
                        console.error('Error sending message:', error);
                        alert('Failed to send message');
                    }
                }
                
                async function loadStats() {
                    try {
                        const response = await fetch('/chat/stats');
                        const stats = await response.json();
                        document.getElementById('stats').innerHTML = 
                            '📊 Total Messages: ' + stats.totalMessages + 
                            ' | 👥 Users: ' + stats.uniqueUsers + 
                            ' | 🟢 Active: ' + stats.activeUsers;
                    } catch (error) {
                        console.error('Error loading stats:', error);
                    }
                }
                
                function escapeHtml(text) {
                    const div = document.createElement('div');
                    div.textContent = text;
                    return div.innerHTML;
                }
                
                // Allow Enter key to send
                document.getElementById('messageInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') sendMessage();
                });
            </script>
        </body>
        </html>
    `);
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
    console.log(`💬 Chat Application running at http://localhost:${PORT}/`);
    console.log('\nChat Endpoints:');
    console.log('  GET  /chat            - Get all chat messages');
    console.log('  GET  /chat/messages   - Get recent messages');
    console.log('  POST /chat/messages   - Send a message');
    console.log('  GET  /chat/users      - Get active users');
    console.log('  GET  /chat/stats      - Get chat statistics');
    console.log('  GET  /chat-ui         - Simple chat interface');
    console.log('\nOpen your browser to http://localhost:3000/chat-ui');
    console.log('\nPress Ctrl+C to stop\n');
});