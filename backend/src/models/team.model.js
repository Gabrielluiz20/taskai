const db = require('../db/pool');

async function criarEquipe(nome) {
  const { rows } = await db.query(
    'INSERT INTO equipes (nome) VALUES ($1) RETURNING id, nome',
    [nome]
  );
  return rows[0];
}

async function buscarPorId(id) {
  const { rows } = await db.query('SELECT * FROM equipes WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = { criarEquipe, buscarPorId };
