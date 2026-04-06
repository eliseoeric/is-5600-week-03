const express = require("express");
const app = express();

app.use(express.json());

// HOME
app.get("/", (req, res) => {
  res.json({ message: "Home Route (Express)" });
});

// ABOUT
app.get("/about", (req, res) => {
  res.json({ message: "About Route (Express)" });
});

// USERS
app.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "Koti" },
    { id: 2, name: "John" }
  ];
  res.json(users);
});

// CHAT SYSTEM
let messages = [];

// GET MESSAGES
app.get("/messages", (req, res) => {
  res.json(messages);
});

// POST MESSAGE
app.post("/messages", (req, res) => {
  const msg = req.body.message;

  if (!msg) {
    return res.status(400).json({ error: "Message required" });
  }

  messages.push(msg);

  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Express server running on port 3000");
});
