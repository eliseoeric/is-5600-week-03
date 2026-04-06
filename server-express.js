const express = require('express');
const app = express();

// HOME ROUTE
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Express Server" });
});

// API ROUTE
app.get('/api', (req, res) => {
  res.json({ message: "API is working" });
});

// CHAT ROUTE (simple chat simulation)
app.get('/chat', (req, res) => {
  res.json({
    user: "Navya",
    message: "Hello! This is a simple chat app."
  });
});

// START SERVER
app.listen(3000, () => {
  console.log("Express Server running on port 3000");
});