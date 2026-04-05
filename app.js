// IMPORT EXPRESS
const express = require('express');

// CREATE APP
const app = express();

// SET PORT
const PORT = 3000;

// MIDDLEWARE (to read JSON body)
app.use(express.json());

// IN-MEMORY DATA (chat messages)
let messages = [
  { id: 1, text: "Hello World" },
  { id: 2, text: "This is your chat API" }
];


// ---------------- ROUTES ---------------- //

// HOME
app.get('/', (req, res) => {
  res.json({ message: "API is running 🚀" });
});


// GET ALL MESSAGES
app.get('/messages', (req, res) => {
  res.json(messages);
});


// GET SINGLE MESSAGE
app.get('/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const message = messages.find(m => m.id === id);

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  res.json(message);
});


// ADD NEW MESSAGE
app.post('/messages', (req, res) => {
  const newMessage = {
    id: messages.length + 1,
    text: req.body.text
  };

  messages.push(newMessage);

  res.status(201).json(newMessage);
});


// DELETE MESSAGE
app.delete('/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);

  messages = messages.filter(m => m.id !== id);

  res.json({ message: "Message deleted" });
});


// ---------------- START SERVER ---------------- //
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});