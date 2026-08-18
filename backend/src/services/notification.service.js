/**
 * RF006 - Notificar prazos próximos ou atrasados
 *
 * Em produção, esta função seria chamada por um job agendado (ex.: cron diário).
 * Por ora, também é exposta via rota para disparo manual/teste (ver tasks.routes.js).
 */
const db = require('../db/pool');
const taskModel = require('../models/task.model');
const userModel = require('../models/user.model');
const emailService = require('./email.service');

async function verificarPrazos() {
  const tarefas = await taskModel.listarComPrazoProximo(2);
  const notificacoesGeradas = [];

  for (const tarefa of tarefas) {
    if (!tarefa.responsavel_id) continue;

    const vencida = new Date(tarefa.prazo) < new Date();
    const mensagem = vencida
      ? `A tarefa "${tarefa.titulo}" está atrasada.`
      : `A tarefa "${tarefa.titulo}" vence em breve (${tarefa.prazo}).`;

    const { rows } = await db.query(
      `INSERT INTO notificacoes (usuario_id, tarefa_id, mensagem)
       VALUES ($1, $2, $3) RETURNING *`,
      [tarefa.responsavel_id, tarefa.id, mensagem]
    );
    notificacoesGeradas.push(rows[0]);

    // Dispara o e-mail de verdade para o responsável pela tarefa
    const responsavel = await userModel.buscarPorId(tarefa.responsavel_id);
    if (responsavel?.email) {
      await emailService.enviarEmailPrazo({
        destinatario: responsavel.email,
        nomeUsuario: responsavel.nome,
        tarefaTitulo: tarefa.titulo,
        mensagem,
      });
    }
  }

  return notificacoesGeradas;
}

module.exports = { verificarPrazos };