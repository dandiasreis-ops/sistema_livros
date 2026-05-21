CREATE DATABASE sistema_livros;
USE sistema_livros;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    saldo_creditos INTEGER DEFAULT 0
);

CREATE TABLE estudantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    nome VARCHAR(100),
    ra VARCHAR(30),
    ano_escolar VARCHAR(20),
    media_notas DECIMAL(4,2),
    tipo_bolsa VARCHAR(50),
    bolsa_percentual INTEGER,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE livros (
	usuario_id INT,
    isbn VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(200),
    disciplina VARCHAR(100),
    estado VARCHAR(30),
    preco_creditos INTEGER,
    quantidade INTEGER DEFAULT 1
);

CREATE TABLE doacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    isbn VARCHAR(20) REFERENCES livros(isbn),
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creditos_gerados INTEGER,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE retiradas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    isbn VARCHAR(20) REFERENCES livros(isbn),
    data_retirada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creditos_utilizados INTEGER,
    status VARCHAR(30),
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    tipo_transacao VARCHAR(50),
    valor INTEGER,
    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO livros (
	usuario_id,
    isbn,
    titulo,
    ano_escolar,
    origem_livro,
    ano_publicacao,
    edicao,
    disciplina,
    estado,
    preco_creditos,
    disponivel
)
VALUES
(
	1,
    '9788521636953',
    'Cálculo I',
    '3em',
    'didatico',
    2024,
    '5',
    'matematica',
    'bom',
    30,
    true
),
(
    1,
    '9788533613379',
    'Física Geral',
    '3em',
    'didatico',
    2025,
    '3',
    'fisica',
    'excelente',
    25,
    true
),
(
    1,
    '9788575227183',
    'Algoritmos',
    '2em',
    'livro_exs',
    2023,
    '4',
    'matematica',
    'regular',
    20,
    true
);

#Alterações nas tabelas
ALTER TABLE livros
ADD COLUMN usuario_id INT;

ALTER TABLE retiradas
ADD COLUMN prioridade INT DEFAULT 0;

ALTER TABLE livros
ADD disponivel BOOLEAN DEFAULT TRUE;

ALTER TABLE livros
ADD COLUMN ano_escolar VARCHAR(20);

ALTER TABLE livros
ADD COLUMN origem VARCHAR(50),
ADD COLUMN ano_publicacao INT,
ADD COLUMN edicao INT;

ALTER TABLE livros
DROP COLUMN quantidade;

ALTER TABLE livros
CHANGE origem origem_livro VARCHAR(50);

#Selects para testes
SELECT * FROM usuarios;
SELECT * FROM livros;
SELECT * FROM estudantes;
SELECT * FROM doacoes;
SELECT * FROM retiradas;
SELECT * FROM historico;

#Usar com cuidado!!!
#DELETE FROM estudantes;
#DELETE FROM retiradas;
#DELETE FROM livros;
#DELETE FROM historico;

#Colocar saldo específico para testes
UPDATE usuarios
SET saldo_creditos = 0
WHERE id = 7;

#Colocar livros manualmente em liberado e concluído
UPDATE retiradas
SET status = 'liberado'
WHERE id = 8;

UPDATE retiradas
SET status = 'concluido'
WHERE id = 6;

#Resetar IDs
ALTER TABLE estudantes AUTO_INCREMENT = 1;
ALTER TABLE retiradas AUTO_INCREMENT = 1;
ALTER TABLE livros AUTO_INCREMENT = 1;
ALTER TABLE historico AUTO_INCREMENT = 1;