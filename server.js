// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Simple Node.js API!');
});

// Example GET route
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
  res.json(users);
});

// Example POST route
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  newUser.id = Math.floor(Math.random() * 1000);
  res.status(201).json({
    message: 'User created successfully!',
    user: newUser
  });
});

// Example route with URL parameter
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  res.json({ message: `You requested user with ID ${userId}` });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

