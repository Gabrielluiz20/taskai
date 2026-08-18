require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const tasksRoutes = require('./routes/tasks.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/tarefas', tasksRoutes);

// Tratamento de erro genérico
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const PORTA = process.env.PORT || 3333;
app.listen(PORTA, () => {
  console.log(`TaskAI backend rodando em http://localhost:${PORTA}`);
});
