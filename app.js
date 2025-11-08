const express = require("express");
const path = require("path");
const events = require("events");

const app = express();
const port = 3000;
const chatEmitter = new events.EventEmitter();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Handle message submission
function respondChat(req, res) {
  const message = req.query.message;
  console.log({ message });
  chatEmitter.emit("message", message);
  res.end();
}

// Handle Server-Sent Events
function respondSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache"
  });

  const onMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  chatEmitter.on("message", onMessage);

  res.on("close", () => {
    chatEmitter.off("message", onMessage);
  });
}

app.get("/chat", respondChat);
app.get("/sse", respondSSE);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});


app.listen(port, () => {
  console.log(`✅ Server is listening on port ${port}`);
});
