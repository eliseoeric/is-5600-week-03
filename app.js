const http = require('http');

const port = process.env.PORT || 3000;

function respondJSON(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const data = {
    message: "Hello from Node API",
    status: "success"
  };

  res.end(JSON.stringify(data));
}

http.createServer(respondJSON).listen(port, () => {
  console.log(`Server running on port ${port}`);
});