import { useState } from 'react';
import { api } from '../api/client';

export default function LoginForm({ onAutenticado }) {
  const [modo, setModo] = useState('login');
  const [form, setForm] = useState({ nome: '', email: '', senha: '', nomeEquipe: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const resposta =
        modo === 'login'
          ? await api.login({ email: form.email, senha: form.senha })
          : await api.cadastrar(form);

      localStorage.setItem('taskai_token', resposta.token);
      onAutenticado(resposta.usuario);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="inline-block stamp text-stamp-red px-3 py-1 text-xs font-bold mb-3">
            SISTEMA DE PRIORIZAÇÃO
          </div>
          <h1 className="font-mono text-3xl font-bold text-ink tracking-tight">TaskAI</h1>
          <p className="text-ink-light text-sm mt-1">Suas tarefas, na ordem certa.</p>
        </div>

        <form onSubmit={enviar} className="card-index p-6 space-y-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-ink-light">
            {modo === 'login' ? 'Entrar' : 'Criar conta'}
          </h2>

          {modo === 'cadastro' && (
            <>
              <input
                className="border border-rule bg-white w-full p-2.5 rounded-sm text-ink placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-stamp-amber"
                placeholder="Seu nome"
                value={form.nome}
                onChange={(e) => atualizarCampo('nome', e.target.value)}
                required
              />
              <input
                className="border border-rule bg-white w-full p-2.5 rounded-sm text-ink placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-stamp-amber"
                placeholder="Nome da equipe"
                value={form.nomeEquipe}
                onChange={(e) => atualizarCampo('nomeEquipe', e.target.value)}
                required
              />
            </>
          )}

          <input
            className="border border-rule bg-white w-full p-2.5 rounded-sm text-ink placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-stamp-amber"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => atualizarCampo('email', e.target.value)}
            required
          />
          <input
            className="border border-rule bg-white w-full p-2.5 rounded-sm text-ink placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-stamp-amber"
            type="password"
            placeholder="Senha"
            value={form.senha}
            onChange={(e) => atualizarCampo('senha', e.target.value)}
            required
          />

          {erro && (
            <p className="text-stamp-red text-sm font-mono border-l-2 border-stamp-red pl-2">
              {erro}
            </p>
          )}

          <button
            className="bg-ink text-linen w-full p-2.5 rounded-sm font-semibold hover:bg-ink/90 transition-colors disabled:opacity-50"
            disabled={carregando}
          >
            {carregando ? 'Enviando...' : modo === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>

          <button
            type="button"
            className="text-sm text-ink-light underline w-full hover:text-ink"
            onClick={() => setModo(modo === 'login' ? 'cadastro' : 'login')}
          >
            {modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}