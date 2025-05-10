# Gerenciador de Tarefas - CRUD Completo

Este é um projeto de exemplo que demonstra um CRUD completo com Node.js no backend e um frontend em JavaScript puro.

## Tecnologias Utilizadas
- Backend: Node.js com Express
- Frontend: HTML, CSS e JavaScript puro
- Armazenamento: JSON (arquivo data.json)

## Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (versão 12 ou superior)
- NPM ou Yarn

### Passos para Execução

1. Clone o repositório (ou copie os arquivos para sua máquina)

2. Instale as dependências do backend:
```bash
cd backend
npm install

3. Inicie o servidor do backend:
```bash
cd backend
npm install

4. Abra o frontend:
- Abra o arquivo frontend/index.html em um navegador web.

5. Acesse a aplicação:
- O backend estará disponível em http://localhost:3000
- O frontend estará disponível no arquivo local ou em http://localhost:5500/frontend (dependendo do servidor usado)

## Rotas da API 

- GET /tasks - Lista todas as tarefas
- GET /tasks/:id - Obtém uma tarefa específica
- POST /tasks - Cria uma nova tarefa
- PUT /tasks/:id - Atualiza uma tarefa existente
- DELETE /tasks/:id - Remove uma tarefa

## Estrutura dos dados 

Cada tarefa possui a seguinte estrutura:

{
    "id": 1,
    "title": "Título da tarefa",
    "description": "Descrição detalhada da tarefa",
    "status": "pendente",
    "createdAt": "2023-05-20T12:00:00.000Z"
}

Os status possíveis são:
- "pendente"
- "em andamento"
- "concluída"

## Como Executar o Projeto

1. Crie as pastas e arquivos conforme a estrutura acima
2. No terminal, navegue até a pasta `backend` e execute:
   ```bash
   npm install express body-parser
   node server.js
3. Abra o arquivo frontend/index.html em um navegador web de sua preferência.
