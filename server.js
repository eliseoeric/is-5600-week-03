const http = require("http");

const server = http.createServer((req, res) => {

  const url = req.url;

  res.setHeader("Content-Type", "application/json");

  if (url === "/" || url === "/index.html") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Home Route Working" }));
  }

  else if (url === "/about") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "About Route Working" }));
  }

  else if (url === "/users") {
    res.statusCode = 200;
    res.end(JSON.stringify([
      { id: 1, name: "Koti" },
      { id: 2, name: "John" }
    ]));
  }

  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Route Not Found" }));
  }

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
