"use strict";

const express = require("express");
const path = require("path");
const EventEmitter = require("events");

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, "public")));

// The final Express version replaces the initial http.createServer router.
// Each response remains in its own function, as in the earlier HTTP steps.
function respondText(req, res) {
  res.type("text/plain").send("hi");
}

function respondJson(req, res) {
  res.json({ text: "hi", numbers: [1, 2, 3] });
}

function respondEcho(req, res) {
  const { input = "" } = req.query;
  if (typeof input !== "string") {
    return res.status(400).json({ error: "Provide one input string." });
  }
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split("").reverse().join(""),
  });
}

function chatApp(req, res) {
  res.sendFile(path.join(__dirname, "chat.html"));
}

function respondChat(req, res) {
  const { message } = req.query;
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Provide a nonempty message." });
  }
  chatEmitter.emit("message", message);
  res.end();
}

function respondSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  // Prefix every line so messages containing newlines remain a single event.
  const onMessage = (message) => {
    const data = message.split(/\r\n|\r|\n/).map((line) => `data: ${line}`).join("\n");
    res.write(`${data}\n\n`);
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
// Keep the plain-text response available after the home route becomes chat.
app.get("/text", respondText);
app.get("/json", respondJson);
app.get("/echo", respondEcho);
app.get("/chat", respondChat);
app.get("/sse", respondSSE);
// The README also mentions opening the supplied page by its filename.
app.get("/chat.html", chatApp);
app.use(respondNotFound);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
