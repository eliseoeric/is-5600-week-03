// Express API example
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Express API" });
});

app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
});

app.post("/users", (req, res) => {
  const user = req.body;
  res.status(201).json({ message: "User added", user });
});

app.listen(PORT, () => console.log(`Express server running on http://localhost:${PORT}`));
