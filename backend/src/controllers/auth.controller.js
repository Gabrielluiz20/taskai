const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const teamModel = require('../models/team.model');

// RF001 - Cadastrar usuário e equipe
async function cadastrar(req, res) {
  const { nome, email, senha, nomeEquipe } = req.body;

  if (!nome || !email || !senha || !nomeEquipe) {
    return res.status(400).json({ erro: 'nome, email, senha e nomeEquipe são obrigatórios.' });
  }

  const existente = await userModel.buscarPorEmail(email);
  if (existente) {
    return res.status(409).json({ erro: 'E-mail já cadastrado.' });
  }

  const equipe = await teamModel.criarEquipe(nomeEquipe);
  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await userModel.criarUsuario({ nome, email, senhaHash, equipeId: equipe.id });

  const token = gerarToken(usuario);
  return res.status(201).json({ usuario, equipe, token });
}

async function login(req, res) {
  const { email, senha } = req.body;
  const usuario = await userModel.buscarPorEmail(email);
  if (!usuario) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  const token = gerarToken(usuario);
  return res.json({
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, equipeId: usuario.equipe_id },
    token,
  });
}

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, equipeId: usuario.equipe_id },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
}

module.exports = { cadastrar, login };
