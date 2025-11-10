const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  newUser.id = Math.floor(Math.random() * 1000);
  res.status(201).json({
    message: 'User created successfully!',
    user: newUser
  });
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  res.json({ message: `You requested user with ID ${userId}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});