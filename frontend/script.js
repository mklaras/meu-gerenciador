// Constante com a URL base da API
const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskIdInput = document.getElementById('taskId');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const statusInput = document.getElementById('status');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const taskList = document.getElementById('taskList');
    
    let editingTaskId = null;
    
    // Carrega as tarefas ao iniciar
    loadTasks();
    
    // Evento de submit do formulário
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const taskData = {
            title: titleInput.value,
            description: descriptionInput.value,
            status: statusInput.value
        };
        
        if (editingTaskId) {
            // Atualiza a tarefa existente
            await updateTask(editingTaskId, taskData);
        } else {
            // Cria uma nova tarefa
            await createTask(taskData);
        }
        
        // Limpa o formulário e recarrega a lista
        resetForm();
        loadTasks();
    });
    
    // Evento do botão cancelar
    cancelBtn.addEventListener('click', () => {
        resetForm();
    });
    
    // Função para carregar tarefas
   async function loadTasks() {
    try {
        // Mostra estado de carregamento
        taskList.innerHTML = '<div class="loading-state">Carregando tarefas...</div>';
        
        const response = await fetch(`${API_BASE_URL}/tasks`);
        
        // Verifica se a resposta foi bem sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const tasks = await response.json();
        
        // Limpa a lista
        taskList.innerHTML = '';
        
        // Verifica se há tarefas
        if (tasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" width="100" alt="Nenhuma tarefa">
                    <p>Nenhuma tarefa encontrada</p>
                </div>
            `;
            return;
        }
        
        // Adiciona cada tarefa à lista
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                <div class="task-header">
                    <h3>${task.title}</h3>
                    <span class="status status-${task.status.replace(' ', '')}">${task.status}</span>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-footer">
                    <small>Criado em: ${new Date(task.createdAt).toLocaleDateString()}</small>
                    <div class="actions">
                        <button onclick="editTask(${task.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="deleteTask(${task.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
        
    } catch (error) {
        console.error('Erro detalhado:', error);
        taskList.innerHTML = `
            <div class="error-state">
                <h4>Erro ao carregar tarefas</h4>
                <p>${error.message}</p>
                <button onclick="loadTasks()">Tentar novamente</button>
            </div>
        `;
    }
}
    // Função para criar uma nova tarefa
    async function createTask(taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao criar tarefa');
            }
            
            alert('Tarefa criada com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao criar tarefa');
        }
    }
    
    // Função para atualizar uma tarefa
    async function updateTask(id, taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao atualizar tarefa');
            }
            
            alert('Tarefa atualizada com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao atualizar tarefa');
        }
    }
    
    // Função para deletar uma tarefa
    async function deleteTask(id) {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Erro ao excluir tarefa');
            }
            
            alert('Tarefa excluída com sucesso!');
            loadTasks();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir tarefa');
        }
    }
    
    // Função para editar uma tarefa
    async function editTask(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
            const task = await response.json();
            
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }
            
            // Preenche o formulário com os dados da tarefa
            taskIdInput.value = task.id;
            titleInput.value = task.title;
            descriptionInput.value = task.description;
            statusInput.value = task.status;
            
            // Atualiza o estado para edição
            editingTaskId = task.id;
            saveBtn.textContent = 'Atualizar';
            cancelBtn.style.display = 'inline-block';
            
            // Rola para o formulário
            taskForm.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar tarefa para edição');
        }
    }
    
    // Função para resetar o formulário
    function resetForm() {
        taskForm.reset();
        taskIdInput.value = '';
        editingTaskId = null;
        saveBtn.textContent = 'Salvar';
        cancelBtn.style.display = 'none';
    }
});

// Funções globais para os botões (necessário por causa do escopo)
window.editTask = async function(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    const task = await response.json();
    
    document.getElementById('taskId').value = task.id;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('status').value = task.status;
    
    document.getElementById('saveBtn').textContent = 'Atualizar';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    
    // Atualiza o estado para edição
    editingTaskId = task.id;
    
    // Rola para o formulário
    document.getElementById('taskForm').scrollIntoView({ behavior: 'smooth' });
};

window.deleteTask = async function(id) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao excluir tarefa');
        }
        
        alert('Tarefa excluída com sucesso!');
        document.dispatchEvent(new Event('DOMContentLoaded'));
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir tarefa');
    }
};