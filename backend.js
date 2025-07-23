const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(express.json());

// Helper to read/write JSON file
function readData() {
    if (!fs.existsSync(DATA_FILE)) return { tasks: [], archive: [] };
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all tasks
app.get('/tasks', (req, res) => {
    const data = readData();
    res.json(data.tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const { title, userType } = req.body;
    if (!title || !userType) return res.status(400).json({ error: 'Missing title or userType' });
    const data = readData();
    const newTask = {
        id: Date.now().toString(),
        title,
        userType, // 'main' or 'caregiver'
        finished: false,
        createdAt: new Date().toISOString(),
    };
    data.tasks.push(newTask);
    writeData(data);
    res.status(201).json(newTask);
});

// Update a task (e.g., mark as finished)
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { finished } = req.body;
    const data = readData();
    const task = data.tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (typeof finished === 'boolean') task.finished = finished;
    writeData(data);
    res.json(task);
});

// Archive a task
app.post('/archive/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    const idx = data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    const [archivedTask] = data.tasks.splice(idx, 1);
    data.archive.push(archivedTask);
    writeData(data);
    res.json(archivedTask);
});

// Get archived tasks
app.get('/archive', (req, res) => {
    const data = readData();
    res.json(data.archive);
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
}); 