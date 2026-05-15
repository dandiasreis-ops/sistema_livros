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
    isbn,
    titulo,
    disciplina,
    estado,
    preco_creditos,
    quantidade
)
VALUES
(
    '9788521636953',
    'Cálculo I',
    'Matemática',
    'bom',
    30,
    5
),
(
    '9788533613379',
    'Física Geral',
    'Física',
    'excelente',
    25,
    3
),
(
    '9788575227183',
    'Algoritmos',
    'Programação',
    'regular',
    20,
    4
);

SELECT * FROM usuarios;
SELECT * FROM estudantes;

#DELETE FROM estudantes;