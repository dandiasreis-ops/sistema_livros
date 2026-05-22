# 📚 Sistema de Doação de Livros Escolares

Sistema web desenvolvido para gerenciamento de doações e solicitações de livros escolares, utilizando o conceito de economia circular para reutilização de materiais didáticos.

O projeto foi desenvolvido como MVP acadêmico, com foco em:

* reutilização de livros escolares
* sistema de créditos
* prioridade social para estudantes
* gerenciamento de filas de retirada
* integração Front-End + API REST + Banco de Dados

---

# 🚀 Funcionalidades

## 👤 Usuários

* Cadastro de usuários
* Login com autenticação
* Atualização de dados
* Controle de sessão

## 📖 Livros

* Cadastro de livros
* Consulta de acervo
* Busca por título
* Sistema de pontuação por doação

## 🎓 Estudantes

* Cadastro de filhos/estudantes
* Controle de prioridade social
* Bolsa acadêmica/social
* Média escolar

## 🔄 Solicitações

* Solicitação de livros
* Controle de fila
* Histórico de retiradas
* Extrato de pontos

---

# 🧱 Tecnologias Utilizadas

## Front-End

* HTML5
* CSS3
* JavaScript Vanilla

## Back-End

* Python
* Flask

## Banco de Dados

* MySQL

---

# 🏗️ Arquitetura do Projeto

O sistema segue uma arquitetura SPA (Single Page Application), onde a navegação ocorre dinamicamente sem recarregar páginas.

## Estrutura Geral

* Front-End em JavaScript puro
* Comunicação via API REST
* Back-End em Flask
* Persistência de dados em MySQL

---

# 🔌 Comunicação com API

A aplicação utiliza `fetch()` para comunicação entre front-end e back-end.

Exemplo de endpoints:

```http
GET /api/livros
POST /api/livros
POST /api/login
POST /api/retiradas
GET /api/extrato
```

---

# ⚙️ Funcionalidades Técnicas

## Refatorações realizadas

* Centralização de rotas SPA
* Criação de funções utilitárias
* Redução de repetição de código
* Criação de camada de serviço (`ApiService`)
* Centralização de traduções
* Melhor separação de responsabilidades

## Code Smells identificados

Durante o desenvolvimento foram identificados alguns pontos de melhoria arquitetural:

* funções muito grandes
* CSS inline excessivo
* chamadas `fetch()` espalhadas
* repetição de HTML
* necessidade de componentização
* código legado/morto após mudanças de API

Parte dessas melhorias já está em processo de refatoração.

---

# 📊 Regras de Negócio

## Sistema de Créditos

Usuários recebem créditos ao doar livros.

Os créditos podem ser utilizados para solicitar novos livros do acervo.

## Prioridade Social

A prioridade na fila considera:

* tipo de bolsa
* percentual da bolsa
* desempenho acadêmico

---

# ▶️ Como Executar o Projeto

## 1. Clonar repositório

```bash
git clone <url-do-repositorio>
```

---

## 2. Instalar dependências do Back-End

```bash
pip install flask
pip install flask-cors
pip install mysql-connector-python
```

---

## 3. Configurar Banco de Dados

Criar banco MySQL e importar as tabelas necessárias.

Atualizar as credenciais de conexão no arquivo do Flask.

---

## 4. Executar servidor Flask

```bash
python app.py
```

Servidor padrão:

```txt
http://127.0.0.1:5000
```

---

## 5. Abrir Front-End

Abrir o arquivo `index.html` no navegador.

---

# 📌 Status do Projeto

## MVP Funcional ✅

O sistema atualmente possui:

* autenticação
* persistência em banco
* cadastro de livros
* sistema de solicitações
* extrato
* gerenciamento de estudantes

## Melhorias Futuras

* modularização completa do front-end
* componentização da interface
* separação de CSS
* autenticação JWT mais robusta
* responsividade aprimorada
* deploy online
* testes automatizados

---

# ♻️ Objetivo Social

O projeto busca incentivar:

* reutilização de materiais escolares
* redução de desperdício
* apoio a famílias com dificuldade financeira
* acesso mais democrático a livros escolares

---
