import { Suspense } from 'react';
import LandingScene from '../components/LandingScene';

export default function Landing({ onEnter }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linen">
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, #d7dcd0 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }} />

      <Suspense fallback={null}>
        <LandingScene />
      </Suspense>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <div className="stamp inline-block text-stamp-red px-3 py-1 text-xs font-bold mb-4">
          SISTEMA DE PRIORIZAÇÃO
        </div>
        <h1 className="font-mono text-5xl sm:text-6xl font-bold text-ink tracking-tight mb-3">
          TaskAI
        </h1>
        <p className="text-ink-light text-lg mb-10 max-w-md">
          Suas tarefas, priorizadas por IA, organizadas como fichas — na ordem certa, sempre.
        </p>
        <button
          onClick={onEnter}
          className="pointer-events-auto bg-ink text-linen px-8 py-3 rounded-sm font-semibold hover:bg-ink/90 transition-colors shadow-lg"
        >
          Entrar no TaskAI
        </button>
      </div>
    </div>
  );
}