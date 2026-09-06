import { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import { getToken } from './api/client';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarLanding, setMostrarLanding] = useState(true);
  const autenticado = Boolean(getToken());

  function sair() {
    localStorage.removeItem('taskai_token');
    setUsuario(null);
    setMostrarLanding(true);
    window.location.reload();
  }

  if (mostrarLanding && !autenticado) {
    return <Landing onEnter={() => setMostrarLanding(false)} />;
  }

  if (!autenticado || !usuario) {
    return <LoginForm onAutenticado={setUsuario} />;
  }

  return <Dashboard usuario={usuario} onSair={sair} />;
}