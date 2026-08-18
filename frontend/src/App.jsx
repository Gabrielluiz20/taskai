import { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import { getToken } from './api/client';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const autenticado = Boolean(getToken());

  function sair() {
    localStorage.removeItem('taskai_token');
    setUsuario(null);
    window.location.reload();
  }

  if (!autenticado || !usuario) {
    return <LoginForm onAutenticado={setUsuario} />;
  }

  return <Dashboard usuario={usuario} onSair={sair} />;
}
