const express = require("express");
const path = require("path");
const EventEmitter = require("events");

const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, "public")));

function chatApp(req, res) {
  res.sendFile(path.join(__dirname, "chat.html"));
}

function respondJson(req, res) {
  res.json({
    text: "hi",
    numbers: [1, 2, 3]
  });
}

function respondEcho(req, res) {
  const input =
    typeof req.query.input === "string" ? req.query.input : "";

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split("").reverse().join("")
  });
}

function respondChat(req, res) {
  const message =
    typeof req.query.message === "string" ? req.query.message : "";

  if (!message.trim()) {
    return res.status(400).send("Please enter a message");
  }

  chatEmitter.emit("message", message);
  res.end();
}

function respondSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });

  res.write(": connected\n\n");

  const onMessage = (message) => {
    const data = message.replace(/\r\n|\r|\n/g, "\ndata: ");
    res.write(`data: ${data}\n\n`);
  };

  chatEmitter.on("message", onMessage);

  res.on("close", () => {
    chatEmitter.off("message", onMessage);
  });
}

function respondNotFound(req, res) {
  res.status(404).type("text/plain").send("Not Found");
}

app.get("/", chatApp);
app.get("/chat.html", chatApp);
app.get("/json", respondJson);
app.get("/echo", respondEcho);
app.get("/chat", respondChat);
app.get("/sse", respondSSE);

app.use(respondNotFound);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});