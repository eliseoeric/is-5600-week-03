const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let messages = [
  { id: 1, text: "Hello there" },
  { id: 2, text: "Welcome to the chat app" }
];

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node API lab" });
});

app.get("/about", (req, res) => {
  res.json({ message: "This is the about route" });
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const newMessage = {
    id: messages.length + 1,
    text: req.body.text
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});