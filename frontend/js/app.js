// Teste de que o front iniciou
console.log("APP INICIOU");

// Traduções pra motrar nos cards
const traducoes = {

    anosEscolares: {
        "ciclo_basico": "Ciclo Básico",

        "1fi": "1º ano",
        "2fi": "2º ano",
        "3fi": "3º ano",
        "4fi": "4º ano",
        "5fi": "5º ano",

        "6fii": "6º ano",
        "7fii": "7º ano",
        "8fii": "8º ano",
        "9fii": "9º ano",

        "1em": "1ª Série",
        "2em": "2ª Série",
        "3em": "3ª Série"
    },

    bolsas: {
        "nenhuma": "Sem bolsa",
        "social": "Bolsa Social",
        "merito": "Mérito Acadêmico"
    },

    tiposLivro: {
        "didatico": "Livro Didático",

        "livro_exs": "Livro de Exercícios",

        "exs_poucas_rasuras":
            "Exercícios com poucas rasuras",

        "literatura": "Livro de Literatura",

        "muitas_rasuras":
            "Muitas rasuras"
    },

    disciplinas: {
        "matematica": "Matemática",
        "fisica": "Física",
        "quimica": "Química",
        "biologia": "Biologia",
        "historia": "História",
        "geografia": "Geografia",
        "portugues": "Português",
        "ingles": "Inglês"
    }
};

// Função extra para normalizar a busca
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Função principal de navegação da SPA
let usuarioLogado = !!localStorage.getItem('token'); // Corrige o token quando a página atualiza
function navigate(page) {
    // 1. Identifica o "palco" onde a tela será exibida
    const app = document.getElementById('app');

    // 2. Limpa o conteúdo atual para receber a nova tela
    app.innerHTML = "";

    // 3. Verifica qual opção o usuário selecionou e "desenha" a tela
    if (page === 'home') {
        app.innerHTML = `
        <div style="padding: 20px;">

            <h1 style="
                color:#004587;
                margin-bottom:10px;
            ">
                📚 Sistema de Doação de Livros
            </h1>

            <p style="
                color:#555;
                margin-bottom:25px;
                line-height:1.5;
            ">
                Plataforma de economia circular para reutilização de livros escolares.
            </p>

            <div style="
                background:white;
                border-radius:12px;
                padding:18px;
                box-shadow:0 2px 6px rgba(0,0,0,0.08);
                margin-bottom:20px;
            ">

                <h3 style="color:#004587; margin-bottom:12px;">
                    🚀 Como funciona?
                </h3>

                <div style="line-height:1.8; color:#444; font-size:0.95rem;">
                    📖 Cadastre livros usados em bom estado.<br>
                    🎯 Receba créditos automaticamente.<br>
                    🛍️ Use os créditos para solicitar novos livros.<br>
                    👨‍🎓 Cadastre estudantes para prioridade social.<br>
                    ♻️ Ajude outras famílias economizando recursos.
                </div>
            </div>

            <div style="
                background:#e8f4ff;
                border-left:5px solid #004587;
                padding:15px;
                border-radius:8px;
                color:#333;
                line-height:1.5;
            ">
                💡 Dica: alunos com bolsa e bom desempenho acadêmico possuem prioridade maior na fila de retirada.
            </div>

        </div>
        `;
    }
// Substitua os blocos antigos por este:
else if (page === 'ver_livros' || page === 'acervo') {
    app.innerHTML = `
        <div style="padding: 10px;">
            <h2 style="font-size: 1.3rem; color: #004587; margin-bottom: 10px;">📚 Catálogo de Livros</h2>
            
            <input type="text" id="busca_livro" placeholder="Pesquisar por título ou autor..." 
                style="padding: 12px; border-radius: 8px; border: 1px solid #ccc; width: 100%; margin-bottom: 15px;">

            <div id="vitrine-livros" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items:start;">
                <p style="grid-column: span 2; text-align: center; padding: 20px;">Carregando livros...</p>
            </div>

            <button onclick="navigate('${usuarioLogado ? 'perfil' : 'home'}')" 
                style="width: 100%; background-color: #6c757d; color: white; padding: 12px; border-radius: 8px; border: none; margin-top: 25px; cursor: pointer;">
                ← Voltar
            </button>
        </div>
    `;

    // Busca os dados no servidor (Tópico 4)
    fetch(`${API_URL}/api/livros`)
        .then(res => res.json())
        .then(livros => {
            const vitrine = document.getElementById('vitrine-livros');

            const renderizar = (lista) => {
                if (lista.length === 0) {
                    vitrine.innerHTML = `<p style="grid-column: span 2; text-align: center;">Nenhum livro encontrado.</p>`;
                    return;
                }

                vitrine.innerHTML = lista.map(livro => `
                    <div style="
                        border: 1px solid #ddd;
                        border-radius: 12px;
                        padding: 12px;
                        background: white;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);

                        display:flex;
                        flex-direction:column;
                        justify-content: center;
                        align-items: center; 

                        min-height:220px;
                    ">

                        <div style="font-size: 2rem; text-align:center;">📖</div>

                        <strong style="
                            display:block;
                            font-size:0.9rem;
                            margin:8px 0;
                            color:#004587;
                        ">
                            ${livro.titulo}
                        </strong>

                        <div style="font-size:0.8rem; color:#555; margin-bottom:4px;">
                            🎓 ${traducoes.anosEscolares[livro.ano_escolar] || livro.ano_escolar || 'Ano não informado'}
                        </div>

                        <div style="font-size:0.8rem; color:#555; margin-bottom:4px;">
                            📚 ${traducoes.disciplinas[livro.disciplina] || livro.disciplina || 'Sem disciplina'}
                        </div>

                        <div style="font-size:0.8rem; color:#555; margin-bottom:4px;">
                            🏷️ ${traducoes.tiposLivro[livro.origem_livro] || livro.origem_livro || 'Tipo não informado'}
                        </div>

                        <div style="font-size:0.8rem; color:#555; margin-bottom:4px;">
                            📖 ${livro.edicao || '-'}ª edição
                        </div>

                        <div style="
                            color:#28a745;
                            font-weight:bold;
                            margin:10px 0;
                            font-size:1rem;
                        ">
                            ${livro.pontos} pts
                        </div>

                        <button onclick="tentarSolicitar(
                            '${livro.isbn}',
                            '${livro.titulo}',
                            ${livro.pontos})"

                            style="
                                width:100%;
                                background:#004587;
                                color:white;
                                border:none;
                                padding:10px;
                                border-radius:6px;
                                font-size:0.8rem;
                                font-weight:bold;
                                cursor:pointer;

                                margin-top:auto;
                            ">
                            Solicitar
                        </button>
                    </div>
                `).join('');
            };

            renderizar(livros);

            document.getElementById('busca_livro').oninput = (e) => {
                const termo = e.target.value.toLowerCase();
                const buscaNormalizada = normalizarTexto(termo);
                const filtrados = livros.filter(livro =>
                    normalizarTexto(livro.titulo)
                        .includes(buscaNormalizada)
                );
                renderizar(filtrados);
            };
        })
        .catch(err => {
            document.getElementById('vitrine-livros').innerHTML = "<p>Erro ao conectar com o banco.</p>";
        });
}
    else if (page === 'doar') {
        if (!usuarioLogado) {
            app.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h2 style="color: #dc3545;">Acesso Restrito</h2>
                    <p>Você precisa estar logado para gerenciar seu perfil.</p>
                    <button onclick="navigate('login')" 
                        style="margin-top: 15px; padding: 10px 20px; background-color: #004587; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Ir para Login / Cadastro
                    </button>
                </div>
            `;
        }
        else {
            app.innerHTML = `
                <h2 style="font-size: 1.2rem; margin-bottom: 10px;">Cadastro de Livro</h2>
                <form id="form-doacao" style="display: flex; flex-direction: column; gap: 8px; text-align: left;">
                    
                    <input type="text" id="titulo" placeholder="Título do Livro" required style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">

                    <input type="text" pattern="[0-9]{10,13}" id="isbn" placeholder="ISBN" required style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    
                    <select id="ano_escolar_livro" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <option value="" disabled selected>Ano Escolar</option>

                        <option value="ciclo_basico">Ciclo Básico</option>

                        <optgroup label="Fundamental I">
                            <option value="1fi">1º ano</option>
                            <option value="2fi">2º ano</option>
                            <option value="3fi">3º ano</option>
                            <option value="4fi">4º ano</option>
                            <option value="5fi">5º ano</option>
                        </optgroup>

                        <optgroup label="Fundamental II">
                            <option value="6fii">6º ano</option>
                            <option value="7fii">7º ano</option>
                            <option value="8fii">8º ano</option>
                            <option value="9fii">9º ano</option>
                        </optgroup>

                        <optgroup label="Ensino Médio">
                            <option value="1em">1º Série</option>
                            <option value="2em">2º Série</option>
                            <option value="3em">3º Série</option>
                        </optgroup>
                    </select>

                    <select id="estado" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <option value="" disabled selected>Estado do Livro</option>

                        <option value="novo">Novo</option>
                        <option value="excelente">Excelente</option>
                        <option value="bom">Bom</option>
                        <option value="regular">Regular</option>
                        <option value="ruim">Ruim</option>
                    </select>

                    <div style="display: flex; gap: 5px;">
                        <select id="ano_publicacao" style="flex: 1; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                            <option value="" disabled selected>Ano de Publicação</option>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                        </select>

                        <select id="edicao" style="flex: 1; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                            <option value="" disabled selected>Edição</option>

                            <option value="1">1ª</option>
                            <option value="2">2ª</option>
                            <option value="3">3ª</option>
                            <option value="4">4ª</option>
                            <option value="5">5ª</option>
                            <option value="6">6ª</option>
                            <option value="7">7ª</option>
                            <option value="8">8ª</option>
                            <option value="9">9ª</option>
                            <option value="10">10ª</option>
                        </select>
                    </div>
                    
                    <select id="disciplina" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <option value="" disabled selected>Disciplina</option>

                        <option value="matematica">Matemática</option>
                        <option value="fisica">Física</option>
                        <option value="quimica">Química</option>
                        <option value="biologia">Biologia</option>
                        <option value="historia">História</option>
                        <option value="geografia">Geografia</option>
                        <option value="portugues">Português</option>
                        <option value="ingles">Inglês</option>
                    </select>

                    <select id="origem_livro" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <option value="" disabled selected>Tipo de Livro</option>

                        <option value="didatico">Livro Didático</option>
                        <option value="livro_exs">Livro de Exercícios (sem rasuras)</option>
                        <option value="exs_poucas_rasuras">Livro de Exercícios (algumas rasuras)</option>
                        <option value="literatura">Livro de Literatura</option>
                        <option value="muitas_rasuras">Didático ou Exercícios (muitas rasuras)</option>
                    </select>

                    <button type="submit" style="background-color: #28a745; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        Cadastrar Livro
                    </button>
                </form>
            `;

            document.getElementById('form-doacao').onsubmit = async (e) => {

                e.preventDefault();

                const dadosLivro = {
                    usuario_id: localStorage.getItem('usuario_id'),
                    isbn: document.getElementById('isbn').value,
                    titulo: document.getElementById('titulo').value,
                    ano_escolar: document.getElementById('ano_escolar_livro').value,
                    origem_livro: document.getElementById('origem_livro').value,
                    ano_publicacao: document.getElementById('ano_publicacao').value,
                    edicao: document.getElementById('edicao').value,
                    disciplina: document.getElementById('disciplina').value,
                    estado: document.getElementById('estado').value,
                };

                try {

                    const resposta = await fetch(`${API_URL}/api/livros`, {

                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify(dadosLivro)
                    });

                    const dados = await resposta.json();

                    if (!resposta.ok) {
                        alert(dados.erro || 'Erro ao cadastrar livro');
                        return;
                    }

                    alert('Livro cadastrado com sucesso!');

                    navigate('ver_livros');

                } catch (erro) {

                    console.error(erro);

                    alert('Erro ao conectar com servidor');
                }
            };
        }
    }



 else if (page === 'perfil') {
    // 1. Verificação de Segurança
    if (!usuarioLogado) {
        app.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h2 style="color: #dc3545;">Acesso Restrito</h2>
                <p>Você precisa estar logado para gerenciar seu perfil.</p>
                <button onclick="navigate('login')" 
                    style="margin-top: 15px; padding: 10px 20px; background-color: #004587; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Ir para Login / Cadastro
                </button>
            </div>
        `;
    }
    else {
        // 2. Tela de carregamento
        app.innerHTML = `<div style="padding: 20px; text-align: center;">Carregando seu painel...</div>`;

        // 3. Chamada real para o Backend (Tópico 4)
        const usuarioId = localStorage.getItem('usuario_id');
        fetch(`${API_URL}/api/dashboard?usuario_id=${usuarioId}`)
            .then(res => res.json())
            .then(dados => {
                // AQUI UNIMOS O VISUAL BONITO COM TODOS OS BOTÕES
                app.innerHTML = `
                    <div style="padding: 15px;">
                        <h2 style="color: #004587; margin-bottom: 5px;">Gestão da Conta</h2>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 20px;">Olá, ${dados.nome}! O que deseja fazer hoje?</p>

                        <div style="background: linear-gradient(135deg, #004587, #0062c0); color: white; padding: 20px; border-radius: 15px; text-align: center; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,69,135,0.2);">
                            <span style="font-size: 0.85rem; opacity: 0.9;">Créditos Acumulados</span>
                            <h1 style="font-size: 2.2rem; margin: 5px 0;">${dados.pontos_total} pts</h1>
                            <div style="font-size: 0.7rem; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; display: inline-block;">
                                Economia Circular Ativa ♻️
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                            
                            <button onclick="navigate('ver_livros')" style="padding: 12px; background: white; border: 1px solid #004587; color: #004587; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">
                                🛍️ Ver Acervo
                            </button>

                            <button onclick="navigate('consultar_dados')" style="padding: 12px; background: white; border: 1px solid #28a745; color: #28a745; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">
                                📊 Extrato e Pontos
                            </button>

                            <button onclick="navigate('dados_filhos')" style="padding: 12px; background: white; border: 1px solid #f39c12; color: #f39c12; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">
                                👶 Ver Filhos
                            </button>

                            <button onclick="navigate('cadastrar_estudante')" style="padding: 12px; background: white; border: 1px solid #17a2b8; color: #17a2b8; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">
                                ➕ Add Filho
                            </button>

                            <button onclick="navigate('editar_dados')" style="padding: 12px; background: white; border: 1px solid #6c757d; color: #6c757d; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 0.8rem; grid-column: span 2;">
                                📝 Consultar e Editar Meus Dados
                            </button>
                        </div>

                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                        <button onclick="usuarioLogado = false; navigate('home');" 
                            style="width: 100%; background: #fff1f1; border: 1px solid #dc3545; color: #dc3545; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                            Sair do Sistema
                        </button>
                    </div>
                `;
            })
            .catch(err => {
                app.innerHTML = `<div style="padding:20px; text-align:center;">
                    <p style="color:red;">Erro ao carregar painel.</p>
                    <button onclick="navigate('perfil')">Tentar Novamente</button>
                </div>`;
            });
    }
}
    else if (page === 'cadastrar_estudante') {
    app.innerHTML = `
        <div style="padding: 10px;">
            <h2 style="font-size: 1.2rem; color: #004587; margin-bottom: 15px;">👤 Cadastro de Estudante</h2>
            
            <form id="form-estudante" style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                <input type="text" id="nome" placeholder="Nome Completo" required style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
                
                <input type="text" id="ra" placeholder="RA / Matrícula" required style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
                
                <select id="ano_escolar" required style="padding: 12px; border-radius: 8px; border: 1px solid #ccc; background: white;">
                    <option value="" disabled selected>Ano escolar</option>
                    
                        <option value="ciclo_basico">Ciclo Básico</option>

                        <optgroup label="Fundamental I">
                            <option value="1fi">1º ano</option>
                            <option value="2fi">2º ano</option>
                            <option value="3fi">3º ano</option>
                            <option value="4fi">4º ano</option>
                            <option value="5fi">5º ano</option>
                        </optgroup>

                        <optgroup label="Fundamental II">
                            <option value="6fii">6º ano</option>
                            <option value="7fii">7º ano</option>
                            <option value="8fii">8º ano</option>
                            <option value="9fii">9º ano</option>
                        </optgroup>

                        <optgroup label="Ensino Médio">
                            <option value="1em">1º Série</option>
                            <option value="2em">2º Série</option>
                            <option value="3em">3º Série</option>
                        </optgroup>
                    </select>
                </select>

                <input type="number" min="0" max="10" step="0.1" id="media_notas" step="0.1" placeholder="Média Geral" required style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
                
                <div style="display: flex; gap: 10px;">
                    <select id="tipo_bolsa" style="flex: 2; padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
                        <option value="" disabled selected>Tipo de Bolsa</option>

                        <option value="nenhuma">Sem bolsa</option>
                        <option value="social">Bolsa Social</option>
                        <option value="merito">Bolsa Mérito Acadêmico</option>
                    </select>

                    <select id="bolsa_percentual" style="flex: 2; padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
                        <option value="" disabled selected>Percentual</option>

                        <option value="0">0%</option>
                        <option value="25">25%</option>
                        <option value="50">50%</option>
                        <option value="75">75%</option>
                        <option value="100">100%</option>
                    </select>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button type="submit" style="flex: 1; background-color: #28a745; color: white; padding: 14px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer;">
                        Salvar no Banco
                    </button>
                    
                    <button type="button" onclick="navigate('dados_filhos')" style="flex: 1; background-color: #6c757d; color: white; padding: 14px; border-radius: 8px; border: none; cursor: pointer;">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    `;

    // Desativar percentual se não tem bolsa
    const selectBolsa = document.getElementById('tipo_bolsa');
    const percentualInput = document.getElementById('bolsa_percentual');

    selectBolsa.onchange = () => {

        if (selectBolsa.value === 'nenhuma') {

            percentualInput.disabled = true;
            percentualInput.value = '';

        } else {

            percentualInput.disabled = false;
        }
    };

    // Lógica para enviar os dados para o Banco (POST)
    document.getElementById('form-estudante').onsubmit = async (e) => {
        e.preventDefault();

        // Pegamos os valores do formulário
        const dadosEstudante = {
            nome: document.getElementById('nome').value,
            ra: document.getElementById('ra').value,
            ano_escolar: document.getElementById('ano_escolar').value,
            media_notas: document.getElementById('media_notas').value,
            tipo_bolsa: document.getElementById('tipo_bolsa').value,
            bolsa_percentual: document.getElementById('bolsa_percentual').value
        };

        // ENVIANDO PARA O BANCO DE DADOS
        const usuarioId = localStorage.getItem('usuario_id');

        await fetch(`${API_URL}/api/estudantes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario_id: usuarioId,
                ...dadosEstudante
            })
        })
        .then(res => {
            if (res.ok) {
                alert('✅ Estudante cadastrado com sucesso!');
                navigate('dados_filhos'); // Volta para a lista de filhos
            } else {
                alert('❌ Erro ao salvar estudante.');
            }
        })
        .catch(err => {
            // Como ainda não tem o link real, vai cair aqui:
            console.log("Simulando salvamento...", dadosEstudante);
            alert('✅ (Simulação) Estudante salvo com sucesso!');
            navigate('dados_filhos');
        });
    };
}
    else if (page === 'login') {
        app.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h2 id="login-title" style="margin-bottom: 20px; color: #004587;">Entrar no Sistema</h2>
                
                <form id="form-auth" style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
    <input type="email" id="email_auth" placeholder="E-mail" required 
        style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
    
    <input type="password" id="senha_auth" placeholder="Senha" required 
        style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
    
    <div id="campos-cadastro" style="display: none; flex-direction: column; gap: 12px;">
        
        <input type="tel" id="cpf_auth" placeholder="CPF (somente números)" 
            maxlength="11"
            style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">

        <input type="password" id="confirma_senha" placeholder="Confirmar Senha" 
            style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
    </div>

                    <button type="submit" id="btn-auth" 
                        style="background-color: #004587; color: white; padding: 12px; border-radius: 8px; border: none; font-weight: bold; margin-top: 10px;">
                        Entrar
                    </button>
                </form>

                <p style="margin-top: 20px; font-size: 0.9rem;">
                    <span id="auth-text">Não tem uma conta?</span> 
                    <a href="#" id="toggle-auth" style="color: #004587; font-weight: bold; text-decoration: none;">Cadastre-se</a>
                </p>
            </div>
        `;

        let modoCadastro = false;
        const btnAuth = document.getElementById('btn-auth');
        const title = document.getElementById('login-title');
        const extraFields = document.getElementById('campos-cadastro');
        const toggleLink = document.getElementById('toggle-auth');
        const authText = document.getElementById('auth-text');

        // Lógica para trocar entre Login e Cadastro
        toggleLink.onclick = (e) => {
            e.preventDefault();
            modoCadastro = !modoCadastro;

            if (modoCadastro) {
                title.innerText = "Criar Nova Conta";
                btnAuth.innerText = "Cadastrar";
                authText.innerText = "Já tem uma conta?";
                toggleLink.innerText = "Fazer Login";
                extraFields.style.display = "flex";
            } else {
                title.innerText = "Entrar no Sistema";
                btnAuth.innerText = "Entrar";
                authText.innerText = "Não tem uma conta?";
                toggleLink.innerText = "Cadastre-se";
                extraFields.style.display = "none";
            }
        };

        // Lógica ao clicar no botão (Submit)
        document.getElementById('form-auth').onsubmit = async (e) => {

            e.preventDefault();

            const email = document.getElementById('email_auth').value;
            const senha = document.getElementById('senha_auth').value;

            try {

                // CADASTRO
                if (modoCadastro) {

                    const cpf = document.getElementById('cpf_auth').value;

                    const resposta = await fetch(`${API_URL}/api/usuarios`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nome: email.split('@')[0],
                            email: email,
                            senha: senha,
                            cpf: cpf
                        })
                    });

                    const dados = await resposta.json();

                    if (!resposta.ok) {
                        alert(dados.erro || 'Erro ao cadastrar');
                        return;
                    }

                    alert('Conta criada com sucesso!');

                }

                // LOGIN
                else {

                    const resposta = await fetch(`${API_URL}/api/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            senha: senha
                        })
                    });

                    const dados = await resposta.json();

                    if (!resposta.ok) {
                        alert(dados.erro || 'Erro no login');
                        return;
                    }

                    localStorage.setItem('token', dados.token);
                    localStorage.setItem('usuario_id', dados.usuario.id);

                    usuarioLogado = true;

                    alert('Login realizado com sucesso!');

                    navigate('perfil');
                }

            } catch (erro) {

                console.error(erro);

                alert('Erro ao conectar com o servidor');
            }
        };
    }
   else if (page === 'consultar_dados') {
    // 1. Tela de carregamento inicial
    app.innerHTML = `<div style="padding: 20px; text-align: center;">Buscando seu extrato e posição na fila...</div>`;

    // 2. Busca os dados no banco (Saldo + Histórico)
    const usuarioId = localStorage.getItem('usuario_id');
    fetch(`${API_URL}/api/extrato?usuario_id=${usuarioId}`)
        .then(res => res.json())
        .then(dados => {

            console.log(dados); // Teste de dados

            let filaHtml = "";
            let liberadosHtml = "";
            let concluidosHtml = "";
            let doadosHtml = "";

            // 3. Nova versão do Extrato/Histórico, que divide os itens por status
            // FILA
            (dados.fila || []).forEach(item => {

                const cardHtml = `
                    <div style="background: #fff3cd; padding: 12px; border-radius: 10px; margin-bottom: 10px;">
                        <strong>${item.titulo}</strong><br>

                        <small>Data: ${item.data}</small><br>

                        <span style="
                            background: #ffc107;
                            color: #856404;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-size: 0.7rem;
                            font-weight: bold;
                        ">
                            Fila: Pos. ${item.posicao}
                        </span>
                    </div>
                `;

                filaHtml += cardHtml;
            });


            // LIBERADOS
            (dados.liberados || []).forEach(item => {

                const cardHtml = `
                    <div style="background: #d4edda; padding: 12px; border-radius: 10px; margin-bottom: 10px;">
                        <strong>${item.titulo}</strong><br>

                        <small>Data: ${item.data}</small><br>

                        <span style="
                            background: #28a745;
                            color: white;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-size: 0.7rem;
                            font-weight: bold;
                        ">
                            Disponível para Retirada
                        </span>
                    </div>
                `;

                liberadosHtml += cardHtml;
            });


            // CONCLUÍDOS
            (dados.concluidos || []).forEach(item => {

                const cardHtml = `
                    <div style="background: #d1ecf1; padding: 12px; border-radius: 10px; margin-bottom: 10px;">
                        <strong>${item.titulo}</strong><br>

                        <small>Data: ${item.data}</small><br>

                        <span style="
                            background: #004587;
                            color: white;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-size: 0.7rem;
                            font-weight: bold;
                        ">
                            Livro Retirado
                        </span>
                    </div>
                `;

                concluidosHtml += cardHtml;
            });

            // 4. Renderiza a página final (O Visual que o professor vai ver)
            app.innerHTML = `
                <div style="padding: 10px;">
                    <h2 style="font-size: 1.3rem; color: #004587; margin-bottom: 15px;">📊 Meu Extrato e Fila</h2>

                    <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <span style="font-size: 0.9rem; opacity: 0.9;">Créditos para Troca</span>
                        <h1 style="font-size: 2.5rem; margin: 5px 0;">${dados.pontos_total}</h1>
                        <small>Baseado em suas doações e prioridade social</small>
                    </div>

                    <h3 style="font-size: 1rem; border-bottom: 2px solid #28a745; padding-bottom: 5px; color: #28a745;">✅ Minhas Doações</h3>
                    <div style="margin: 10px 0 20px 0;">
                        ${dados.doacoes.map(livro => `
                            <div style="background:#e8f5e9; padding:10px; border-radius:8px; margin-bottom:8px;">
                                <strong>${livro.titulo}</strong><br>
                                <small>+${livro.pontos} créditos recebidos</small>
                            </div>
                        `).join('')}
                    </div>

                    <h3 style="color: #856404;">⏳ Em Fila</h3>
                    <div>
                        ${filaHtml || '<p>Nenhuma solicitação na fila.</p>'}
                    </div>

                    <h3 style="color: #155724; margin-top: 20px;">✅ Liberados</h3>
                    <div>
                        ${liberadosHtml || '<p>Nenhum livro liberado.</p>'}
                    </div>

                    <h3 style="color: #6c757d; margin-top: 20px;">📚 Concluídos</h3>
                    <div>
                        ${concluidosHtml || '<p>Nenhuma retirada concluída.</p>'}
                    </div>

                    <button onclick="navigate('perfil')" 
                        style="width: 100%; background-color: #6c757d; color: white; padding: 12px; border-radius: 8px; border: none; margin-top: 20px; cursor: pointer; font-weight: bold;">
                        ← Voltar ao Perfil
                    </button>
                </div>
            `;
        })
        .catch(err => {
            // TRATAMENTO DE ERRO VISUAL (CONFORME O DOCUMENTO)
            app.innerHTML = `
                <div style="padding: 30px; text-align: center;">
                    <p style="color: #dc3545; font-weight: bold;">⚠️ Erro ao carregar extrato.</p>
                    <p style="font-size: 0.8rem; color: #666;">Não conseguimos conectar ao banco de dados MySQL.</p>
                    <button onclick="navigate('consultar_dados')" style="margin-top: 15px; padding: 10px; border-radius: 5px; border: 1px solid #ccc; cursor: pointer;">Tentar Novamente</button>
                </div>
            `;
        });
}
   else if (page === 'editar_dados') {
        app.innerHTML = `<div style="padding: 20px; text-align: center;">Buscando suas informações...</div>`;

        // 1. Buscamos os dados atuais do usuário logado
        const usuarioId = localStorage.getItem('usuario_id');
        fetch(`${API_URL}/api/usuario/${usuarioId}`) // ID do usuário logado
            .then(res => res.json())
            .then(usuario => {
                app.innerHTML = `
                    <div style="padding: 15px;">
                        <h2 style="font-size: 1.3rem; color: #004587; margin-bottom: 10px;">📝 Meus Dados</h2>
                        <p style="font-size: 0.8rem; color: #666; margin-bottom: 20px;">Atualize suas informações de contato e segurança.</p>

                        <form id="form-editar" style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
                            
                            <label style="font-weight: bold; font-size: 0.8rem; color: #444;">E-mail de Acesso:</label>
                            <input type="email" id="edit_email" value="${usuario.email}" required 
                                style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
                            
                            <label style="font-weight: bold; font-size: 0.8rem; color: #444;">CPF (Identificador):</label>
                            <input type="text" id="edit_cpf" value="${usuario.cpf}" 
                                style="padding: 12px; border-radius: 8px; border: 1px solid #ccc; background-color: #f5f5f5;" readonly>
                            <small style="color: #999; margin-top: -8px;">O CPF é vinculado à sua conta e não pode ser alterado.</small>

                            <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">

                            <label style="font-weight: bold; font-size: 0.8rem; color: #444;">Nova Senha:</label>
                            <input type="password" id="edit_senha" placeholder="Deixe em branco para manter a atual" 
                                style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">

                            <label style="font-weight: bold; font-size: 0.8rem; color: #444;">Confirmar Nova Senha:</label>
                            <input type="password" id="edit_confirma" placeholder="Confirme a nova senha" 
                                style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">

                            <div style="display: flex; gap: 10px; margin-top: 20px;">
                                <button type="submit" 
                                    style="flex: 1; background-color: #004587; color: white; padding: 14px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer;">
                                    Salvar Alterações
                                </button>
                                
                                <button type="button" onclick="navigate('perfil')" 
                                    style="flex: 1; background-color: #6c757d; color: white; padding: 14px; border-radius: 8px; border: none; cursor: pointer;">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                `;

                // Lógica de envio para o banco (Update)
                document.getElementById('form-editar').onsubmit = async (e) => {
                    e.preventDefault();
                    
                    // Teste para atualização de senha
                    const campoSenha = document.getElementById('edit_senha');
                    const campoConfirma = document.getElementById('edit_confirma');

                    if (!campoSenha || !campoConfirma) {
                        alert("Campos de senha não encontrados.");
                        return;
                    }

                    const novaSenha = document.getElementById('edit_senha').value;
                    const confirma = document.getElementById('edit_confirma').value;

                    if (novaSenha !== confirma) {
                        alert("⚠️ As senhas não coincidem!");
                        return;
                    }

                    try {

                        const usuarioId = localStorage.getItem('usuario_id');

                        const resposta = await fetch(
                            `${API_URL}/api/usuario/${usuarioId}`,
                            {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    email: document.getElementById('edit_email').value,
                                    senha: novaSenha
                                })
                            }
                        );

                        const dados = await resposta.json();

                        if (!resposta.ok) {
                            alert(dados.erro);
                            return;
                        }

                        alert("✅ Dados atualizados com sucesso!");

                        navigate('perfil');

                    } catch (erro) {

                        console.error(erro);

                        alert("Erro ao atualizar usuário");
                    }
                };
            })
            .catch(err => {
                app.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">Erro ao carregar seus dados. Tente novamente.</p>`;
            });
    }
    else if (page === 'dados_filhos') {
    // 1. Primeiro, mostramos uma tela de carregamento com o título
    app.innerHTML = `
        <div style="padding: 15px;">
            <h2 style="font-size: 1.3rem; color: #004587; margin-bottom: 15px;">👶 Meus Filhos / Estudantes</h2>
            <div id="container-lista" style="text-align: center; padding: 20px;">Carregando dados do banco...</div>
        </div>
    `;

    // 2. Chamamos o banco de dados
    const usuarioId = localStorage.getItem('usuario_id');
    fetch(`${API_URL}/api/filhos?usuario_id=${usuarioId}`)
        .then(res => res.json())
        .then(filhos => {
            const container = document.getElementById('container-lista');

            // 3. SE tiver filhos no banco:
            if (filhos && filhos.length > 0) {
                let htmlLista = "";

                filhos.forEach(f => {
                    // Usamos o modelo de card bonito aqui
                    htmlLista += `
                    <div style="
                        background: white;
                        padding: 15px;
                        border-radius: 12px;
                        border: 1px solid #ddd;
                        margin-bottom: 15px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    ">

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            align-items:flex-start;
                            margin-bottom:10px;
                        ">
                            <div>
                                <strong style="font-size:1rem; color:#004587;">
                                    ${f.nome}
                                </strong><br>

                                <small style="color:#666;">
                                    RA: ${f.ra}
                                </small>
                            </div>

                            <div style="
                                background:#004587;
                                color:white;
                                padding:8px 12px;
                                border-radius:10px;
                                text-align:center;
                                min-width:70px;
                            ">
                                <div style="font-size:0.7rem;">
                                    Prioridade
                                </div>

                                <div style="
                                    font-size:1.2rem;
                                    font-weight:bold;
                                ">
                                    ${f.prioridade || 0}
                                </div>
                            </div>
                        </div>

                        <div style="font-size:0.85rem; color:#555; line-height:1.6;">
                            🎓 ${traducoes.anosEscolares[f.ano_escolar] || f.ano_escolar}<br>
                            📊 Média: ${f.media_notas}<br>
                            🎯 Bolsa: ${traducoes.bolsas[f.tipo_bolsa] || f.tipo_bolsa || 'Nenhuma'}<br>
                            💰 Percentual: ${f.bolsa_percentual || 0}%
                        </div>

                        <button 
                            onclick="confirmarExclusao('${f.nome}', ${f.id})"

                            style="
                                margin-top:12px;
                                width:100%;
                                background:#fff1f1;
                                border:1px solid #dc3545;
                                color:#dc3545;
                                padding:10px;
                                border-radius:8px;
                                cursor:pointer;
                                font-weight:bold;
                            "
                        >
                            🗑️ Remover
                        </button>
                    </div>
                    `;
                });

                // Inserimos a lista e os botões de ação
                container.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                        ${htmlLista}
                    </div>
                    <button onclick="navigate('cadastrar_estudante')" 
                        style="width: 100%; background-color: #004587; color: white; padding: 12px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; margin-bottom: 10px;">
                        + Cadastrar Novo Filho
                    </button>
                    <button onclick="navigate('perfil')" 
                        style="width: 100%; background-color: #6c757d; color: white; padding: 12px; border-radius: 8px; border: none; cursor: pointer;">
                        Voltar ao Perfil
                    </button>
                `;
            }
            // 4. SE NÃO tiver nada no banco:
            else {
                container.innerHTML = `
                    <p style="color: #666;">Nenhum filho cadastrado ainda.</p>
                    <button onclick="navigate('cadastrar_estudante')" style="width: 100%; background-color: #004587; color: white; padding: 12px; border-radius: 8px; border: none; font-weight: bold; margin-top: 10px;">
                        + Cadastrar Primeiro Filho
                    </button>
                `;
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('container-lista').innerHTML = "<p style='color: red;'>Erro ao conectar com o servidor.</p>";
        });
}
}

// Carrega a página inicial assim que o site abrir
window.onload = () => navigate('home');
async function confirmarExclusao(nome, id) {

    const certeza = confirm(
        "Tem certeza que deseja excluir os dados de " + nome + "?"
    );

    if (!certeza) return;

    try {

        const resposta = await fetch(
            `http://127.0.0.1:5000/api/estudantes/${id}`,
            {
                method: 'DELETE'
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro);
            return;
        }

        alert("✅ " + nome + " removido com sucesso!");

        navigate('dados_filhos');

    } catch (erro) {

        console.error(erro);

        alert("Erro ao remover estudante");
    }
}

// Versão nova da solicitação
async function tentarSolicitar(isbn, titulo, pontos) {

    if (!usuarioLogado) {

        alert("Ops! Você precisa estar logado.");

        navigate('login');

        return;
    }

    const confirmar = confirm(
        `Confirmar solicitação:\n\n${titulo}\n${pontos} créditos`
    );

    if (!confirmar) return;

    try {

        const usuarioId = localStorage.getItem('usuario_id');

        const resposta = await fetch(`${API_URL}/api/retiradas`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                usuario_id: usuarioId,
                isbn: isbn
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.erro || 'Erro ao solicitar livro');

            return;
        }

        alert('Livro solicitado com sucesso!');

        navigate('consultar_dados');

    } catch (erro) {

        console.error(erro);

        alert('Erro ao conectar com servidor');
    }
}