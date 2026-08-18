const taskModel = require('../models/task.model');
const priorityService = require('../services/priority.service');

// RF002 - Cadastrar tarefa
async function criar(req, res) {
  const { titulo, descricao, prazo, responsavelId, impacto, dependeDeIds } = req.body;
  const { equipeId, id: usuarioId } = req.usuario;

  if (!titulo) {
    return res.status(400).json({ erro: 'titulo é obrigatório.' });
  }

  const tarefa = await taskModel.criarTarefa({
    titulo,
    descricao,
    prazo,
    // Se nenhum responsável for informado, quem criou a tarefa vira o responsável
    responsavelId: responsavelId || usuarioId,
    equipeId,
    impacto,
    dependeDeIds,
  });

  // RF003 - recalcula a prioridade de toda a equipe ao criar uma nova tarefa
  await priorityService.recalcularPrioridadesDaEquipe(equipeId);

  const tarefaAtualizada = await taskModel.buscarPorId(tarefa.id);
  return res.status(201).json(tarefaAtualizada);
}

// RF004 - Visualizar tarefas em quadro Kanban
async function listar(req, res) {
  const { equipeId } = req.usuario;
  const tarefas = await taskModel.listarPorEquipe(equipeId);

  const quadro = {
    a_fazer: tarefas.filter(t => t.status === 'a_fazer'),
    fazendo: tarefas.filter(t => t.status === 'fazendo'),
    em_teste: tarefas.filter(t => t.status === 'em_teste'),
    feito: tarefas.filter(t => t.status === 'feito'),
  };

  return res.json(quadro);
}

// Move a tarefa entre colunas do Kanban
async function atualizarStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const statusValidos = ['a_fazer', 'fazendo', 'em_teste', 'feito'];

  if (!statusValidos.includes(status)) {
    return res.status(400).json({ erro: `status deve ser um de: ${statusValidos.join(', ')}` });
  }

  const tarefa = await taskModel.atualizarStatus(id, status);

  // RF003 - recalcula prioridades quando uma tarefa é concluída (libera dependências)
  await priorityService.recalcularPrioridadesDaEquipe(req.usuario.equipeId);

  return res.json(tarefa);
}

// RF005 - Ajustar prioridade manualmente
async function ajustarPrioridade(req, res) {
  const { id } = req.params;
  const { posicao } = req.body;

  if (typeof posicao !== 'number') {
    return res.status(400).json({ erro: 'posicao deve ser um número.' });
  }

  const tarefa = await taskModel.definirPrioridadeManual(id, posicao);
  return res.json(tarefa);
}

module.exports = { criar, listar, atualizarStatus, ajustarPrioridade };