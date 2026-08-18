const { Router } = require('express');
const tasksController = require('../controllers/tasks.controller');
const notificationService = require('../services/notification.service');
const { autenticar } = require('../middleware/auth.middleware');

const router = Router();

router.use(autenticar); // todas as rotas de tarefas exigem usuário autenticado

router.post('/', tasksController.criar);                          // RF002
router.get('/', tasksController.listar);                          // RF004
router.patch('/:id/status', tasksController.atualizarStatus);     // mover no Kanban
router.patch('/:id/prioridade', tasksController.ajustarPrioridade); // RF005

// Disparo manual da verificação de prazos (RF006) - em produção, usar um job agendado
router.post('/notificacoes/verificar', async (_req, res) => {
  const notificacoes = await notificationService.verificarPrazos();
  res.json(notificacoes);
});

module.exports = router;
