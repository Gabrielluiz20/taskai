# TaskAI

Sistema de gestão de tarefas com priorização automatizada por Inteligência Artificial,
desenvolvido como parte do Projeto Integrador II (ADS).

## Estrutura do projeto

```
taskai/
├── backend/                  # API REST (Node.js + Express + PostgreSQL)
│   ├── src/
│   │   ├── index.js          # ponto de entrada do servidor
│   │   ├── routes/           # definição dos endpoints (auth, tarefas)
│   │   ├── controllers/      # regras de entrada/saída das requisições
│   │   ├── services/
│   │   │   ├── priority.service.js       # RF003 - módulo de priorização (IA)
│   │   │   └── notification.service.js   # RF006 - notificações de prazo
│   │   ├── models/           # acesso ao banco de dados (usuários, equipes, tarefas)
│   │   ├── middleware/       # autenticação (JWT)
│   │   └── db/
│   │       ├── pool.js       # conexão com o PostgreSQL
│   │       └── schema.sql    # criação das tabelas
│   ├── package.json
│   └── .env.example
│
└── frontend/                 # Interface web (React + Vite + Tailwind)
    ├── src/
    │   ├── main.jsx / App.jsx
    │   ├── api/client.js     # chamadas à API
    │   ├── components/
    │   │   ├── LoginForm.jsx     # RF001
    │   │   ├── TaskForm.jsx      # RF002
    │   │   ├── KanbanBoard.jsx   # RF004
    │   │   └── TaskCard.jsx      # RF004 / RF005
    │   └── pages/
    │       └── Dashboard.jsx
    └── package.json
```

## Requisitos funcionais implementados (esqueleto inicial)

| RF | Descrição | Onde está |
|----|-----------|-----------|
| RF001 | Cadastrar usuário e equipe | `auth.controller.js`, `LoginForm.jsx` |
| RF002 | Cadastrar tarefa | `tasks.controller.js`, `TaskForm.jsx` |
| RF003 | Calcular prioridade da tarefa (IA) | `priority.service.js` |
| RF004 | Visualizar tarefas em quadro Kanban | `tasks.controller.js` (listar), `KanbanBoard.jsx` |
| RF005 | Ajustar prioridade manualmente | `tasks.controller.js` (ajustarPrioridade), `TaskCard.jsx` |
| RF006 | Notificar prazos próximos ou atrasados | `notification.service.js` |

O módulo de priorização (`priority.service.js`) usa, por enquanto, um modelo de
**pontuação por regras** (prazo + impacto + dependências + histórico da equipe),
documentado no próprio código. Essa abordagem já demonstra o requisito funcional
de ponta a ponta e deixa um ponto único de evolução para, futuramente, treinar um
modelo de machine learning real com os dados da tabela `historico_priorizacao`.

## Como rodar localmente

### 1. Banco de dados
Crie um banco PostgreSQL e execute o script `backend/src/db/schema.sql`.

### 2. Backend
```bash
cd backend
cp .env.example .env   # ajuste DATABASE_URL e JWT_SECRET
npm install
npm run dev             # inicia em http://localhost:3333
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev              # inicia em http://localhost:5173
```

## Próximos passos (conforme cronograma do PI-II)

1. Testes com cenários simulados de equipes pequenas (Semana 3-4 de implementação)
2. Ajuste do modelo de priorização a partir do feedback dos testes
3. Capturas de tela do fluxo completo para a seção 10 do documento do projeto
4. Gravação do vídeo de demonstração (Semana 7)
