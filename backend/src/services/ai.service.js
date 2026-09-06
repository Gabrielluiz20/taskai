/**
 * ai.service.js
 *
 * RF003 (versão com IA real) - usa a API da Anthropic (modelos Claude) para
 * analisar uma tarefa e decidir sua prioridade, retornando um score (0 a 1)
 * e uma justificativa em texto explicando o porquê.
 *
 * Diferente da versão anterior (só uma fórmula com pesos fixos), aqui é o
 * modelo de linguagem que raciocina sobre os dados da tarefa e decide.
 * Se a chave não estiver configurada, ou a chamada falhar, o
 * priority.service.js cai de volta para o cálculo por fórmula (ver função
 * calcularPrioridadePorFormula lá).
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001'; // rápido e barato, ideal para essa análise curta

async function analisarPrioridade({ tarefa, scoreDependencias, scoreHistorico }) {
  if (!ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY não configurada - usando cálculo por fórmula como alternativa.');
    return null;
  }

  const hoje = new Date().toISOString().slice(0, 10);

  const prompt = `Você é o motor de priorização de tarefas do TaskAI. Analise a tarefa abaixo e decida sua prioridade.

Tarefa: ${tarefa.titulo}
Descrição: ${tarefa.descricao || '(sem descrição)'}
Prazo: ${tarefa.prazo || '(sem prazo definido)'}
Data de hoje: ${hoje}
Impacto informado pelo usuário (1 a 5, sendo 5 o mais alto): ${tarefa.impacto || 3}
Proporção de outras tarefas que dependem desta (0 a 1, quanto maior mais tarefas ficam travadas esperando esta): ${scoreDependencias.toFixed(2)}
Indicador de quanto a equipe costuma repriorizar manualmente tarefas parecidas (0 a 1): ${scoreHistorico.toFixed(2)}

Responda SOMENTE com um JSON válido, sem markdown, sem texto antes ou depois, no formato:
{"score": <número entre 0 e 1, sendo 1 a prioridade mais urgente>, "justificativa": "<uma frase curta em português explicando a decisão>"}`;

  try {
    const resposta = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!resposta.ok) {
      console.error('Erro na API da Anthropic:', resposta.status, await resposta.text());
      return null;
    }

    const dados = await resposta.json();
    const texto = dados.content?.[0]?.text?.trim();
    const analisado = JSON.parse(texto);

    if (typeof analisado.score !== 'number' || !analisado.justificativa) {
      console.error('Resposta da IA em formato inesperado:', texto);
      return null;
    }

    return {
      score: Math.max(0, Math.min(1, analisado.score)),
      justificativa: analisado.justificativa,
    };
  } catch (erro) {
    console.error('Falha ao consultar a IA para priorização:', erro.message);
    return null;
  }
}

module.exports = { analisarPrioridade };