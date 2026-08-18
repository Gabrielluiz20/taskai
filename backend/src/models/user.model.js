const db = require('../db/pool');

async function criarUsuario({ nome, email, senhaHash, equipeId }) {
  const { rows } = await db.query(
    `INSERT INTO usuarios (nome, email, senha_hash, equipe_id)
     VALUES ($1, $2, $3, $4) RETURNING id, nome, email, equipe_id`,
    [nome, email, senhaHash, equipeId]
  );
  return rows[0];
}

async function buscarPorEmail(email) {
  const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return rows[0] || null;
}

async function buscarPorId(id) {
  const { rows } = await db.query(
    'SELECT id, nome, email, equipe_id FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

module.exports = { criarUsuario, buscarPorEmail, buscarPorId };
