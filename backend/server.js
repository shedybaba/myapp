const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory "database" — resets on every restart (good enough to learn with)
let tasks = [
  { id: 1, text: 'Deploy backend to Railway', done: false },
  { id: 2, text: 'Deploy frontend to Vercel', done: false },
];
let nextId = 3;

app.get('/', (req, res) => {
  res.json({ message: 'Task API is running' });
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  const task = { id: nextId++, text: text.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'not found' });
  if (typeof req.body.done === 'boolean') task.done = req.body.done;
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter((t) => t.id !== Number(req.params.id));
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
