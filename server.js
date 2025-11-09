// server.js
const express = require("express");
const path = require("path");
const { EventEmitter } = require("events");

const PORT = process.env.PORT || 3200;
const server = express();
const messageStream = new EventEmitter();


server.use(express.static(path.join(__dirname, "public")));


const handleText = (req, res) => {
  res.type("text").send("hello there");
};


const handleJson = (req, res) => {
  res.json({
    message: "hello there",
    values: [10, 20, 30],
  });
};


const handleEcho = (req, res) => {
  const { input = "" } = req.query;
  res.json({
    original: input,
    uppercase: input.toUpperCase(),
    length: input.length,
    reversed: [...input].reverse().join(""),
  });
};


const serveChat = (req, res) => {
  res.sendFile(path.resolve(__dirname, "chat.html"));
};


const handleChat = (req, res) => {
  const { message } = req.query;
  if (message) messageStream.emit("update", message);
  res.status(200).end();
};

// Route handler: SSE (real-time updates)
const handleSSE = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  const sendMessage = (msg) => res.write(`data: ${msg}\n\n`);
  messageStream.on("update", sendMessage);

  req.on("close", () => {
    messageStream.off("update", sendMessage);
  });
};

// ROUTES
server.get("/", serveChat);
server.get("/text", handleText);
server.get("/json", handleJson);
server.get("/echo", handleEcho);
server.get("/chat", handleChat);
server.get("/stream", handleSSE);


server.listen(PORT, () => {
  console.log(`🚀 Server is active at http://localhost:${PORT}`);
});
