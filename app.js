// Import required modules
const express = require("express");
const EventEmitter = require("events");
const path = require("path");

const chatEmitter = new EventEmitter();
const port = process.env.PORT || 3000;
const app = express();

// Serve static files from the "public" directory
app.use(express.static(__dirname + "/public"));

// Define route handlers for different endpoints
app.get("/", chatApp);
app.get("/json", respondJson);
app.get("/echo", respondEcho);
app.get("/chat", respondChat);
app.get("/sse", respondSSE);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Function to serve the chat application HTML file
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, "/chat.html"));
}

// Function to handle incoming chat messages and emit them as events
function respondChat(req, res) {
  const { message } = req.query;
  console.log({ message });
  chatEmitter.emit("message", message);
  res.end();
}

// Function to handle Server-Sent Events (SSE) for real-time message updates
function respondSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });

  const onMessage = (message) => res.write(`data: ${message}\n\n`);

  chatEmitter.on("message", onMessage);

  res.on("close", () => {
    chatEmitter.off("message", onMessage);
  });
}

// Function to respond with plain text
function respondText(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.end("hi");
}

// Function to respond with JSON data
function respondJson(req, res) {
  res.json({
    text: "hi",
    numbers: [1, 2, 3],
  });
}

// Function to respond with 404 Not Found for unknown routes
function respondNotFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}

// Function to echo back the input with various transformations
function respondEcho(req, res) {
  const { input = "" } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split("").reverse().join(""),
  });
}
