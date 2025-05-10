const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());

// Configuração do CORS
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];

// Configuração do CORS (coloque logo após os middlewares)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Helper functions
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { tasks: [] };
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// Rotas CRUD
// GET /tasks - Lista todas as tarefas
app.get('/tasks', (req, res) => {
    const data = readData();
    res.json(data.tasks);
});

// GET /tasks/:id - Obtém uma tarefa específica
app.get('/tasks/:id', (req, res) => {
    const data = readData();
    const task = data.tasks.find(t => t.id === parseInt(req.params.id));
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: 'Tarefa não encontrada' });
    }
});

// POST /tasks - Cria uma nova tarefa
app.post('/tasks', (req, res) => {
    const data = readData();
    const newTask = {
        id: data.tasks.length > 0 ? Math.max(...data.tasks.map(t => t.id)) + 1 : 1,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'pendente',
        createdAt: new Date().toISOString()
    };
    data.tasks.push(newTask);
    writeData(data);
    res.status(201).json(newTask);
});

// PUT /tasks/:id - Atualiza uma tarefa
app.put('/tasks/:id', (req, res) => {
    const data = readData();
    const index = data.tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index !== -1) {
        const updatedTask = {
            ...data.tasks[index],
            title: req.body.title || data.tasks[index].title,
            description: req.body.description || data.tasks[index].description,
            status: req.body.status || data.tasks[index].status
        };
        data.tasks[index] = updatedTask;
        writeData(data);
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Tarefa não encontrada' });
    }
});

// DELETE /tasks/:id - Remove uma tarefa
app.delete('/tasks/:id', (req, res) => {
    const data = readData();
    const index = data.tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index !== -1) {
        const deletedTask = data.tasks.splice(index, 1)[0];
        writeData(data);
        res.json(deletedTask);
    } else {
        res.status(404).json({ message: 'Tarefa não encontrada' });
    }
});

// Rota para a raiz - apenas para confirmar que o backend está rodando
app.get('/', (req, res) => {
    res.json({
        message: "Backend está rodando!",
        endpoints: {
            tasks: {
                GET: "/tasks",
                POST: "/tasks",
                PUT: "/tasks/:id",
                DELETE: "/tasks/:id"
            }
        }
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});