/**
 * Conexão única (pool) com o PostgreSQL, reutilizada por toda a aplicação.
 */
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // exemplo local: postgres://usuario:senha@localhost:5432/taskai
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
