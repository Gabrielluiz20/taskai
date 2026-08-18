const db = require('../db/pool');

// RF002: Cadastrar tarefa
async function criarTarefa({ titulo, descricao, prazo, responsavelId, equipeId, impacto, dependeDeIds = [] }) {
  const { rows } = await db.query(
    `INSERT INTO tarefas (titulo, descricao, prazo, responsavel_id, equipe_id, impacto)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [titulo, descricao, prazo, responsavelId, equipeId, impacto || 3]
  );
  const tarefa = rows[0];

  for (const dependeDeId of dependeDeIds) {
    await db.query(
      'INSERT INTO dependencias_tarefa (tarefa_id, depende_de_id) VALUES ($1, $2)',
      [tarefa.id, dependeDeId]
    );
  }

  return tarefa;
}

// RF004: Visualizar tarefas em quadro Kanban (lista ordenada por prioridade)
async function listarPorEquipe(equipeId) {
  const { rows } = await db.query(
    `SELECT * FROM tarefas
     WHERE equipe_id = $1
     ORDER BY COALESCE(prioridade_manual, 999) ASC, prioridade_score DESC`,
    [equipeId]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await db.query('SELECT * FROM tarefas WHERE id = $1', [id]);
  return rows[0] || null;
}

// Atualiza status (usado ao mover tarefa entre colunas do Kanban)
async function atualizarStatus(id, status) {
  const { rows } = await db.query(
    `UPDATE tarefas SET status = $1, atualizada_em = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0];
}

// RF005: Ajustar prioridade manualmente
async function definirPrioridadeManual(id, posicao) {
  const { rows } = await db.query(
    `UPDATE tarefas SET prioridade_manual = $1, atualizada_em = NOW() WHERE id = $2 RETURNING *`,
    [posicao, id]
  );
  await db.query(
    `INSERT INTO historico_priorizacao (tarefa_id, ajuste_manual, origem)
     VALUES ($1, $2, 'usuario')`,
    [id, posicao]
  );
  return rows[0];
}

// RF006: tarefas com prazo próximo ou vencido, ainda não concluídas
async function listarComPrazoProximo(diasAntecedencia = 2) {
  const { rows } = await db.query(
    `SELECT * FROM tarefas
     WHERE status != 'feito'
       AND prazo IS NOT NULL
       AND prazo <= (CURRENT_DATE + $1::int)`,
    [diasAntecedencia]
  );
  return rows;
}

module.exports = {
  criarTarefa,
  listarPorEquipe,
  buscarPorId,
  atualizarStatus,
  definirPrioridadeManual,
  listarComPrazoProximo,
};
