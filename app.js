const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());  // Parse incoming JSON data

let messages = [];  // In-memory store for messages

// Home route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Chat API!" });
});

// Get all chat messages
app.get('/chat', (req, res) => {
    res.json({ messages });
});

// Post a new message to the chat
app.post('/chat', (req, res) => {
    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).json({ error: " You must enter your username and message" });
    }

    messages.push({ username, message });
    res.status(201).json({ message: "Message sent" });
});

// Catch-all route for unknown paths
app.use((req, res) => {
    res.status(404).json({ message: " No route was identified" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
