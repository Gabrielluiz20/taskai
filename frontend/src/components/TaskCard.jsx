export default function TaskCard({ tarefa, onMover, onSubirPrioridade }) {
  const proximaColuna = {
    a_fazer: 'fazendo',
    fazendo: 'em_teste',
    em_teste: 'feito',
  }[tarefa.status];

  const score = Number(tarefa.prioridade_score);
  const nivel =
    score >= 0.7
      ? { texto: 'URGENTE', cor: 'text-stamp-red', borda: 'border-stamp-red' }
      : score >= 0.4
      ? { texto: 'MÉDIO', cor: 'text-stamp-amber', borda: 'border-stamp-amber' }
      : { texto: 'BAIXO', cor: 'text-stamp-green', borda: 'border-stamp-green' };

  return (
    <div className="card-index p-3 mb-3 relative">
      <p className="font-semibold text-ink pr-2">{tarefa.titulo}</p>

      {tarefa.prazo && (
        <p className="text-xs text-ink-light font-mono mt-1">
          prazo · {new Date(tarefa.prazo).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center justify-between mt-2.5">
        <span className={`stamp ${nivel.cor} ${nivel.borda} text-[10px] font-bold px-2 py-0.5`}>
          {nivel.texto} · {score.toFixed(2)}
        </span>
        {tarefa.prioridade_manual != null && (
          <span className="text-[10px] font-mono text-ink-light">#{tarefa.prioridade_manual}</span>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        {proximaColuna && (
          <button
            className="text-xs bg-linen text-ink px-2.5 py-1 rounded-sm border border-rule hover:bg-rule/40 transition-colors"
            onClick={() => onMover(tarefa.id, proximaColuna)}
          >
            Mover →
          </button>
        )}
        <button
          className="text-xs bg-stamp-amber/10 text-stamp-amber px-2.5 py-1 rounded-sm border border-stamp-amber/40 hover:bg-stamp-amber/20 transition-colors"
          onClick={() => onSubirPrioridade(tarefa.id)}
        >
          Priorizar
        </button>
      </div>
    </div>
  );
}