import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import TaskForm from '../components/TaskForm';
import KanbanBoard from '../components/KanbanBoard';

export default function Dashboard({ usuario, onSair }) {
  const [quadro, setQuadro] = useState(null);
  const [erro, setErro] = useState('');

  const carregarTarefas = useCallback(async () => {
    try {
      const dados = await api.listarTarefas();
      setQuadro(dados);
    } catch (err) {
      setErro(err.message);
    }
  }, []);

  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);

  async function moverTarefa(id, novoStatus) {
    await api.atualizarStatus(id, novoStatus);
    carregarTarefas();
  }

  // RF005 - ajuste manual simples: manda a tarefa para o topo (posição 1)
  async function subirPrioridade(id) {
    await api.ajustarPrioridade(id, 1);
    carregarTarefas();
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">TaskAI — Olá, {usuario.nome}</h1>
        <button className="text-sm text-blue-600 underline" onClick={onSair}>
          Sair
        </button>
      </header>

      <TaskForm onTarefaCriada={carregarTarefas} />

      {erro && <p className="text-red-600 text-sm">{erro}</p>}

      <KanbanBoard quadro={quadro} onMover={moverTarefa} onSubirPrioridade={subirPrioridade} />
    </div>
  );
}
