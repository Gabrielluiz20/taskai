/**
 * priority.service.js
 *
 * RF003 - Calcular prioridade da tarefa (módulo de IA)
 *
 * Nesta primeira versão, a "IA" é um modelo de pontuação (scoring) baseado em regras,
 * combinando prazo, impacto, dependências e histórico da equipe. Esse serviço foi
 * isolado dos demais (ver RNF "Modificabilidade") para permitir, no futuro, substituir
 * o cálculo por um modelo de machine learning treinado com o histórico de priorização
 * (tabela historico_priorizacao) sem alterar o restante do sistema.
 */

const db = require('../db/pool');

const PESOS = {
  prazo: 0.45,
  impacto: 0.30,
  dependencias: 0.15,
  historico: 0.10,
};

/**
 * Calcula um score de urgência de prazo: quanto mais perto (ou vencido), maior o score.
 * @param {Date|null} prazo
 * @returns {number} 0 a 1
 */
function scorePrazo(prazo) {
  if (!prazo) return 0.3; // tarefa sem prazo definido recebe urgência baixa/média
  const hoje = new Date();
  const dias = Math.ceil((new Date(prazo) - hoje) / (1000 * 60 * 60 * 24));
  if (dias <= 0) return 1;        // atrasada ou vence hoje
  if (dias <= 2) return 0.9;
  if (dias <= 5) return 0.7;
  if (dias <= 10) return 0.4;
  return 0.2;
}

/**
 * Normaliza o impacto (1 a 5) para escala 0-1.
 */
function scoreImpacto(impacto) {
  const valor = Number(impacto) || 3;
  return Math.min(Math.max(valor, 1), 5) / 5;
}

/**
 * Tarefas com mais dependentes (outras tarefas que dependem dela) sobem de prioridade,
 * pois desbloqueiam mais trabalho.
 */
async function scoreDependencias(tarefaId) {
  const { rows } = await db.query(
    'SELECT COUNT(*)::int AS total FROM dependencias_tarefa WHERE depende_de_id = $1',
    [tarefaId]
  );
  const total = rows[0]?.total ?? 0;
  return Math.min(total / 3, 1); // 3+ dependentes já satura o score
}

/**
 * Considera o histórico de ajustes manuais da equipe: se a equipe costuma priorizar
 * tarefas do mesmo responsável ou com prazos parecidos, aumenta levemente o score.
 * Implementação inicial simplificada; espaço reservado para evolução futura.
 */
async function scoreHistorico(equipeId) {
  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS total FROM historico_priorizacao hp
     JOIN tarefas t ON t.id = hp.tarefa_id
     WHERE t.equipe_id = $1 AND hp.origem = 'usuario'`,
    [equipeId]
  );
  const ajustesManuais = rows[0]?.total ?? 0;
  // Equipes com muitos ajustes manuais recentes recebem um leve fator de atenção extra
  return Math.min(ajustesManuais / 10, 0.5);
}

/**
 * Calcula e persiste o score de prioridade de uma tarefa.
 * @param {object} tarefa - registro da tabela `tarefas`
 * @returns {Promise<number>} score final (0 a 1)
 */
async function calcularPrioridade(tarefa) {
  const [dep, hist] = await Promise.all([
    scoreDependencias(tarefa.id),
    scoreHistorico(tarefa.equipe_id),
  ]);

  const score =
    PESOS.prazo * scorePrazo(tarefa.prazo) +
    PESOS.impacto * scoreImpacto(tarefa.impacto) +
    PESOS.dependencias * dep +
    PESOS.historico * hist;

  await db.query(
    'UPDATE tarefas SET prioridade_score = $1, atualizada_em = NOW() WHERE id = $2',
    [score, tarefa.id]
  );

  await db.query(
    `INSERT INTO historico_priorizacao (tarefa_id, score_calculado, origem)
     VALUES ($1, $2, 'ia')`,
    [tarefa.id, score]
  );

  return score;
}

/**
 * Recalcula a prioridade de todas as tarefas em aberto de uma equipe.
 * Chamado sempre que uma tarefa é criada, alterada ou concluída (RF003).
 */
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
