const http = require("http");
const url = require("url");
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const { pathname, query } = parsed;
  res.setHeader("Content-Type", "application/json");

  if (pathname === "/" && req.method === "GET") {
    return res.end(JSON.stringify({ message: "Welcome to Lab 03 HTTP server" }));
  }
  if (pathname === "/api/health" && req.method === "GET") {
    return res.end(JSON.stringify({ status: "healthy", time: new Date() }));
  }
  if (pathname === "/api/echo" && req.method === "GET") {
    return res.end(JSON.stringify({ query }));
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => console.log(`HTTP server → http://localhost:${PORT}`));
