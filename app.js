
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // to parse JSON body
app.use(express.static(path.join(__dirname, "public"))); // serve static files (HTML, CSS, JS)

// In-memory messages array
let messages = [];

// Routes
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Message text is required" });
  }
  const newMessage = {
    id: messages.length + 1,
    text,
    timestamp: new Date(),
  };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
