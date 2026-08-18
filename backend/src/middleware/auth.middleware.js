const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ erro: 'Token não informado.' });
  }
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.usuario = payload; // { id, equipeId }
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = { autenticar };
