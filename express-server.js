const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Welcome to Lab 03 Express server" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date() }));
app.get("/api/echo", (req, res) => res.json({ query: req.query }));
app.post("/api/echo", (req, res) => res.json({ body: req.body }));
app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => console.log(`Express server → http://localhost:${PORT}`));
