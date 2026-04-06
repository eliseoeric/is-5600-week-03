const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let messages = [
  { id: 1, username: "Alice", text: "Hello everyone!" },
  { id: 2, username: "Bob", text: "Welcome to the chat API." }
];

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Express Chat API",
    endpoints: [
      "GET /",
      "GET /messages",
      "GET /messages/:id",
      "POST /messages",
      "DELETE /messages/:id"
    ]
  });
});

app.get("/messages", (req, res) => {
  res.status(200).json(messages);
});

app.get("/messages/:id", (req, res) => {
  const id = Number(req.params.id);
  const message = messages.find((msg) => msg.id === id);

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  res.status(200).json(message);
});

app.post("/messages", (req, res) => {
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({
      error: "username and text are required"
    });
  }

  const newMessage = {
    id: messages.length ? messages[messages.length - 1].id + 1 : 1,
    username,
    text
  };

  messages.push(newMessage);

  res.status(201).json({
    message: "Message added successfully",
    data: newMessage
  });
});

app.delete("/messages/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = messages.findIndex((msg) => msg.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Message not found" });
  }

  const deletedMessage = messages.splice(index, 1)[0];

  res.status(200).json({
    message: "Message deleted successfully",
    deleted: deletedMessage
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});