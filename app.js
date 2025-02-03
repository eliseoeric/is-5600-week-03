// Import required modules
const express = require("express"); // Express web framework
const EventEmitter = require("events"); // EventEmitter for handling events
const path = require("path"); // Path module for working with file and directory paths
const chatEmitter = new EventEmitter(); // Create an instance of EventEmitter for chat functionality
const port = process.env.PORT || 3000; // Define the port, use environment variable or default to 3000
const app = express(); // Initialize an Express application

// Serve static files from the "public" directory
app.use(express.static(__dirname + "/public"));

// Define route handlers for different endpoints
app.get("/", chatApp); // Route for serving the chat application HTML
app.get("/json", respondJson); // Route for responding with JSON data
app.get("/echo", respondEcho); // Route for echoing input with various transformations
app.get("/chat", respondChat); // Route for handling chat messages
app.get("/sse", respondSSE); // Route for Server-Sent Events (SSE) for live updates

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Function to serve the chat application HTML file
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, "/chat.html")); // Send the chat.html file
}

// Function to handle incoming chat messages and emit them as events
function respondChat(req, res) {
  const { message } = req.query; // Get the message from the query string
  console.log({ message }); // Log the message to the console
  chatEmitter.emit("message", message); // Emit the message event
  res.end(); // End the response
}

// Function to handle Server-Sent Events (SSE) for real-time message updates
function respondSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream", // Set content type for SSE
    Connection: "keep-alive", // Keep the connection open for streaming
  });

  // Define a listener function that writes incoming messages to the response
  const onMessage = (message) => res.write(`data: ${message}\n\n`);

  chatEmitter.on("message", onMessage); // Add the listener to the "message" event

  // Remove the listener when the client closes the connection
  res.on("close", () => {
    chatEmitter.off("message", onMessage);
  });
}

// Function to respond with plain text
function respondText(req, res) {
  res.setHeader("Content-Type", "text/plain"); // Set response content type to plain text
  res.end("hi"); // Send a simple "hi" message
}

// Function to respond with JSON data
function respondJson(req, res) {
  res.json({
    text: "hi",
    numbers: [1, 2, 3], // Example JSON response
  });
}

// Function to respond with 404 Not Found for unknown routes
function respondNotFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/plain" }); // Set response to 404 and plain text
  res.end("Not Found"); // Send "Not Found" message
}

// Function to echo back the input with various transformations
function respondEcho(req, res) {
  const { input = "" } = req.query; // Get the input from the query string, default to an empty string if not provided
  res.json({
    normal: input, // Original input
    shouty: input.toUpperCase(), // Input in uppercase
    charCount: input.length, // Character count of the input
    backwards: input.split("").reverse().join(""), // Input reversed
  });
}
