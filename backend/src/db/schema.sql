-- TaskAI - Schema do banco de dados (PostgreSQL)
-- Baseado nos requisitos RF001-RF006 do PI-II

CREATE TABLE IF NOT EXISTS equipes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    criada_em TIMESTAMP DEFAULT NOW()
);

-- RF001: Cadastrar usuário e equipe
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    equipe_id INTEGER REFERENCES equipes(id) ON DELETE SET NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- RF002: Cadastrar tarefa
CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(160) NOT NULL,
    descricao TEXT,
    prazo DATE,
    responsavel_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    equipe_id INTEGER REFERENCES equipes(id) ON DELETE CASCADE,
    impacto SMALLINT DEFAULT 3,           -- 1 (baixo) a 5 (alto), informado pelo usuário
    status VARCHAR(20) DEFAULT 'a_fazer', -- a_fazer | fazendo | em_teste | feito
    prioridade_score NUMERIC DEFAULT 0,   -- calculado pelo módulo de IA (RF003)
    prioridade_manual INTEGER,            -- ajuste manual do usuário (RF005), sobrepõe o score se definido
    criada_em TIMESTAMP DEFAULT NOW(),
    atualizada_em TIMESTAMP DEFAULT NOW()
);

-- Dependências entre tarefas (usadas no cálculo de prioridade)
CREATE TABLE IF NOT EXISTS dependencias_tarefa (
    tarefa_id INTEGER REFERENCES tarefas(id) ON DELETE CASCADE,
    depende_de_id INTEGER REFERENCES tarefas(id) ON DELETE CASCADE,
    PRIMARY KEY (tarefa_id, depende_de_id)
);

-- Histórico de priorização (RF003 / RF005) - guarda cada recálculo e ajuste manual
CREATE TABLE IF NOT EXISTS historico_priorizacao (
    id SERIAL PRIMARY KEY,
    tarefa_id INTEGER REFERENCES tarefas(id) ON DELETE CASCADE,
    score_calculado NUMERIC,
    ajuste_manual INTEGER,
    origem VARCHAR(20), -- 'ia' | 'usuario'
    criado_em TIMESTAMP DEFAULT NOW()
);

-- RF006: Notificações de prazo
CREATE TABLE IF NOT EXISTS notificacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    tarefa_id INTEGER REFERENCES tarefas(id) ON DELETE CASCADE,
    mensagem VARCHAR(255) NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    criada_em TIMESTAMP DEFAULT NOW()
);
