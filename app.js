// Import required modules
const express = require("express"); // Express web framework for building the server
const EventEmitter = require("events"); // EventEmitter to handle event-driven communication
const path = require("path"); // Path module to handle file and directory paths

const chatEmitter = new EventEmitter(); // Create an EventEmitter instance for chat functionality
const port = process.env.PORT || 3000; // Define the port, default to 3000 or use environment variable
const app = express(); // Initialize the Express application

// Serve static files from the "public" directory
app.use(express.static(__dirname + "/public"));

// Define route handlers for different endpoints

// Route for serving the chat application HTML page
app.get("/", chatApp);

// Route for responding with JSON data
app.get("/json", respondJson);

// Route for echoing input with various transformations
app.get("/echo", respondEcho);

// Route for handling chat messages (this is where chat messages will be processed)
app.get("/chat", respondChat);

// Route for Server-Sent Events (SSE) to provide live updates to the client
app.get("/sse", respondSSE);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Function to serve the chat application HTML file
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, "/chat.html")); // Sends the "chat.html" file to the client
}

// Function to handle incoming chat messages and emit them as events
function respondChat(req, res) {
  const { message } = req.query; // Get the message from the query string
  console.log({ message }); // Log the message to the console
  chatEmitter.emit("message", message); // Emit a "message" event with the received message
  res.end(); // End the response after processing
}

// Function to handle Server-Sent Events (SSE) for real-time message updates
function respondSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream", // Set the response type to SSE
    Connection: "keep-alive", // Keep the connection open for continuous data flow
  });

  // Define a listener function that writes incoming messages to the response
  const onMessage = (message) => res.write(`data: ${message}\n\n`);

  chatEmitter.on("message", onMessage); // Add the listener to the "message" event

  // Remove the listener when the client closes the connection
  res.on("close", () => {
    chatEmitter.off("message", onMessage); // Remove the listener when the connection ends
  });
}

// Function to respond with plain text
function respondText(req, res) {
  res.setHeader("Content-Type", "text/plain"); // Set response content type to plain text
  res.end("hi"); // Send a simple "hi" message as a response
}

// Function to respond with JSON data
function respondJson(req, res) {
  res.json({
    text: "hi", // A simple text message
    numbers: [1, 2, 3], // An array of numbers to include in the JSON response
  });
}

// Function to respond with 404 Not Found for unknown routes
function respondNotFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/plain" }); // Set the response status to 404
  res.end("Not Found"); // Send "Not Found" message as response body
}

// Function to echo back the input with various transformations
function respondEcho(req, res) {
  const { input = "" } = req.query; // Get the input from the query string (default to empty string if not provided)
  res.json({
    normal: input, // Original input
    shouty: input.toUpperCase(), // Input in uppercase (shouted version)
    charCount: input.length, // Character count of the input
    backwards: input.split("").reverse().join(""), // Input reversed
  });
}
