import { useState } from 'react';
import { api } from '../api/client';

export default function TaskForm({ onTarefaCriada }) {
  const [form, setForm] = useState({ titulo: '', descricao: '', prazo: '', impacto: 3 });
  const [erro, setErro] = useState('');

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    try {
      await api.criarTarefa(form);
      setForm({ titulo: '', descricao: '', prazo: '', impacto: 3 });
      onTarefaCriada();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <form onSubmit={enviar} className="card-index p-5 space-y-3">
      <h2 className="font-mono text-xs uppercase tracking-widest text-ink-light">
        + Nova ficha de tarefa
      </h2>

      <input
        className="border border-rule bg-white w-full p-2.5 rounded-sm text-ink placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-stamp-amber"
        placeholder="Título"
        value={form.titulo}
        onChange={(e) => atualizarCampo('titulo', e.target.value)}
        required
      />
      <textarea
        className="border border-rule bg-white w-full p-2.5 rounded-sm text-ink placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-stamp-amber"
        placeholder="Descrição"
        rows={2}
        value={form.descricao}
        onChange={(e) => atualizarCampo('descricao', e.target.value)}
      />
      <div className="flex gap-3">
        <input
          className="border border-rule bg-white p-2.5 rounded-sm flex-1 text-ink focus:outline-none focus:ring-2 focus:ring-stamp-amber"
          type="date"
          value={form.prazo}
          onChange={(e) => atualizarCampo('prazo', e.target.value)}
        />
        <select
          className="border border-rule bg-white p-2.5 rounded-sm text-ink focus:outline-none focus:ring-2 focus:ring-stamp-amber"
          value={form.impacto}
          onChange={(e) => atualizarCampo('impacto', Number(e.target.value))}
        >
          <option value={1}>Impacto baixo</option>
          <option value={3}>Impacto médio</option>
          <option value={5}>Impacto alto</option>
        </select>
      </div>

      {erro && (
        <p className="text-stamp-red text-sm font-mono border-l-2 border-stamp-red pl-2">
          {erro}
        </p>
      )}

      <button className="bg-ink text-linen px-5 py-2.5 rounded-sm font-semibold hover:bg-ink/90 transition-colors">
        Adicionar tarefa
      </button>
    </form>
  );
}