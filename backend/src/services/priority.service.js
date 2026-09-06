/**
 * priority.service.js
 *
 * RF003 - Calcular prioridade da tarefa
 *
 * Agora quem decide a prioridade é de fato uma IA (Claude, via ai.service.js):
 * ela recebe os dados da tarefa e retorna um score com justificativa em texto.
 * Se a IA não estiver configurada (sem chave) ou a chamada falhar, o sistema
 * cai de volta automaticamente para o cálculo por fórmula (regras fixas de
 * prazo, impacto, dependências e histórico), para nunca deixar de calcular
 * uma prioridade.
 */

const db = require('../db/pool');
const aiService = require('./ai.service');

const PESOS = {
  prazo: 0.45,
  impacto: 0.30,
  dependencias: 0.15,
  historico: 0.10,
};

function scorePrazo(prazo) {
  if (!prazo) return 0.3;
  const hoje = new Date();
  const dias = Math.ceil((new Date(prazo) - hoje) / (1000 * 60 * 60 * 24));
  if (dias <= 0) return 1;
  if (dias <= 2) return 0.9;
  if (dias <= 5) return 0.7;
  if (dias <= 10) return 0.4;
  return 0.2;
}

function scoreImpacto(impacto) {
  const valor = Number(impacto) || 3;
  return Math.min(Math.max(valor, 1), 5) / 5;
}

async function scoreDependencias(tarefaId) {
  const { rows } = await db.query(
    'SELECT COUNT(*)::int AS total FROM dependencias_tarefa WHERE depende_de_id = $1',
    [tarefaId]
  );
  const total = rows[0]?.total ?? 0;
  return Math.min(total / 3, 1);
}

async function scoreHistorico(equipeId) {
  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS total FROM historico_priorizacao hp
     JOIN tarefas t ON t.id = hp.tarefa_id
     WHERE t.equipe_id = $1 AND hp.origem = 'usuario'`,
    [equipeId]
  );
  const ajustesManuais = rows[0]?.total ?? 0;
  return Math.min(ajustesManuais / 10, 0.5);
}

function calcularPrioridadePorFormula(tarefa, dep, hist) {
  const score =
    PESOS.prazo * scorePrazo(tarefa.prazo) +
    PESOS.impacto * scoreImpacto(tarefa.impacto) +
    PESOS.dependencias * dep +
    PESOS.historico * hist;
  return {
    score,
    justificativa: 'Calculado por fórmula (prazo, impacto, dependências e histórico) — a IA não estava disponível no momento.',
  };
}

async function calcularPrioridade(tarefa) {
  const [dep, hist] = await Promise.all([
    scoreDependencias(tarefa.id),
    scoreHistorico(tarefa.equipe_id),
  ]);

  const analiseIA = await aiService.analisarPrioridade({ tarefa, scoreDependencias: dep, scoreHistorico: hist });

  const { score, justificativa } = analiseIA
    ? { score: analiseIA.score, justificativa: analiseIA.justificativa }
    : calcularPrioridadePorFormula(tarefa, dep, hist);

  const origem = analiseIA ? 'ia' : 'formula';

  await db.query(
    'UPDATE tarefas SET prioridade_score = $1, prioridade_justificativa = $2, atualizada_em = NOW() WHERE id = $3',
    [score, justificativa, tarefa.id]
  );

  await db.query(
    `INSERT INTO historico_priorizacao (tarefa_id, score_calculado, origem)
     VALUES ($1, $2, $3)`,
    [tarefa.id, score, origem]
  );

  return score;
}

async function recalcularPrioridadesDaEquipe(equipeId) {
  const { rows: tarefas } = await db.query(
    `SELECT * FROM tarefas WHERE equipe_id = $1 AND status != 'feito'`,
    [equipeId]
  );
  for (const tarefa of tarefas) {
    await calcularPrioridade(tarefa);
  }
}

module.exports = {
  calcularPrioridade,
  recalcularPrioridadesDaEquipe,
};