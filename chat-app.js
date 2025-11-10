const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "messages.json");

app.use(express.json());

function readMessages() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return []; }
}
function saveMessages(m) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(m, null, 2));
}

app.get("/", (req, res) => res.json({ message: "Tiny Chat API" }));
app.get("/api/messages", (req, res) => res.json(readMessages()));
app.post("/api/messages", (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) return res.status(400).json({ error: "user and text required" });
  const msgs = readMessages();
  const newMsg = { id: Date.now(), user, text, ts: new Date().toISOString() };
  msgs.push(newMsg); saveMessages(msgs);
  res.status(201).json(newMsg);
});

app.listen(PORT, () => console.log(`Chat API → http://localhost:${PORT}`));
