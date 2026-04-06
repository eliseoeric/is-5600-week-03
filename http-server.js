const http = require("http");
const url = require("url");

const users = [
  { id: 1, name: "Alice", role: "Student" },
  { id: 2, name: "Bob", role: "Instructor" },
  { id: 3, name: "Charlie", role: "Developer" }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        message: "Welcome to the basic Node API",
        endpoints: ["/", "/about", "/users"]
      })
    );
  } else if (req.method === "GET" && pathname === "/about") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        app: "Lab 3 Node API",
        version: "1.0.0",
        developer: "Badrinath Lagadapati"
      })
    );
  } else if (req.method === "GET" && pathname === "/users") {
    res.writeHead(200);
    res.end(JSON.stringify(users));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});