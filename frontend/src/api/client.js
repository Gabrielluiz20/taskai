const BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3333/api';

function getToken() {
  return localStorage.getItem('taskai_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.erro || 'Erro na requisição.');
  }
  return data;
}

export const api = {
  cadastrar: (dados) => request('/auth/cadastro', { method: 'POST', body: dados }),
  login: (dados) => request('/auth/login', { method: 'POST', body: dados }),
  listarTarefas: () => request('/tarefas'),
  criarTarefa: (dados) => request('/tarefas', { method: 'POST', body: dados }),
  atualizarStatus: (id, status) =>
    request(`/tarefas/${id}/status`, { method: 'PATCH', body: { status } }),
  ajustarPrioridade: (id, posicao) =>
    request(`/tarefas/${id}/prioridade`, { method: 'PATCH', body: { posicao } }),
};

export { getToken };
