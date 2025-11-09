const http = require("http");
const PORT = 3000;

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/" && req.method === "GET") {
    res.end(JSON.stringify({ message: "Welcome to my Node API" }));
  } else if (req.url === "/users" && req.method === "GET") {
    res.end(JSON.stringify(users));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
