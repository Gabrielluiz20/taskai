import TaskCard from './TaskCard';

const COLUNAS = [
  { chave: 'a_fazer', titulo: 'A Fazer', cor: 'bg-stamp-red/10 text-stamp-red' },
  { chave: 'fazendo', titulo: 'Fazendo', cor: 'bg-stamp-amber/10 text-stamp-amber' },
  { chave: 'em_teste', titulo: 'Em Teste', cor: 'bg-ink/10 text-ink' },
  { chave: 'feito', titulo: 'Feito', cor: 'bg-stamp-green/10 text-stamp-green' },
];

export default function KanbanBoard({ quadro, onMover, onSubirPrioridade }) {
  if (!quadro) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-8">
      {COLUNAS.map((coluna) => (
        <div key={coluna.chave} className="mt-3">
          <div className={`tab-header inline-block ${coluna.cor} px-3 py-1 rounded-sm mb-3`}>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider">
              {coluna.titulo}
              <span className="ml-1.5 opacity-60">
                {(quadro[coluna.chave] || []).length}
              </span>
            </h3>
          </div>

          <div className="border-l-2 border-dashed border-rule pl-3 min-h-[80px]">
            {(quadro[coluna.chave] || []).length === 0 && (
              <p className="text-xs text-ink-light/60 italic font-mono">vazio</p>
            )}
            {(quadro[coluna.chave] || []).map((tarefa) => (
              <TaskCard
                key={tarefa.id}
                tarefa={tarefa}
                onMover={onMover}
                onSubirPrioridade={onSubirPrioridade}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}