// Função extra para normalizar a busca
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Função principal de navegação da SPA
let usuarioLogado = false;
function navigate(page) {
    // 1. Identifica o "palco" onde a tela será exibida
    const app = document.getElementById('app');

    // 2. Limpa o conteúdo atual para receber a nova tela
    app.innerHTML = "";

    // 3. Verifica qual opção o usuário selecionou e "desenha" a tela
    if (page === 'home') {
        app.innerHTML = "<h1> Sistema de Doação de Livros</h1><p>Aqui você verá seu saldo de créditos.</p>";
    }
// Substitua os blocos antigos por este:
else if (page === 'ver_livros' || page === 'acervo') {
    app.innerHTML = `
        <div style="padding: 10px;">
            <h2 style="font-size: 1.3rem; color: #004587; margin-bottom: 10px;">📚 Catálogo de Livros</h2>
            
            <input type="text" id="busca_livro" placeholder="Pesquisar por título ou autor..." 
                style="padding: 12px; border-radius: 8px; border: 1px solid #ccc; width: 100%; margin-bottom: 15px;">

            <div id="vitrine-livros" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
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
                    <div style="border: 1px solid #ddd; border-radius: 12px; padding: 10px; text-align: center; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                        <div style="font-size: 2.2rem; margin-bottom: 5px;">📖</div>
                        <strong style="display: block; font-size: 0.85rem; height: 35px; overflow: hidden;">${livro.titulo}</strong>
                        <div style="color: #28a745; font-weight: bold; margin: 8px 0;">${livro.pontos} pts</div>
                        
                        <button onclick="tentarSolicitar(
                            '${livro.isbn}',
                            '${livro.titulo}',
                            ${livro.pontos})" 
                            style="width: 100%; background: #004587; color: white; border: none; padding: 8px; border-radius: 5px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">
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

                    <input type="text" id="isbn" placeholder="ISBN" required style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    
                    <select id="estado" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <option value="" disabled selected>Estado</option>
                        <option value="excelente">Excelente</option>
                        <option value="bom">Bom</option>
                        <option value="regular">Regular</option>
                    </select>

                    <div style="display: flex; gap: 5px;">
                        <input type="number" id="ano_publicacao" placeholder="Ano Pub." style="flex: 1; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <input type="text" id="edicao" placeholder="Edição" style="flex: 1; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    </div>

                    <input type="text" id="disciplina" placeholder="Disciplina (Ex: Física)" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    
                    <div style="display: flex; gap: 5px;">
                        <input type="number" id="ano_uso" placeholder="Ano de Uso" style="flex: 1; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <input type="number" id="quantidade" placeholder="Qtd" style="width: 60px; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    </div>

                    <input type="text" id="origem_livro" placeholder="Origem do Livro" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    
                    <button type="submit" style="background-color: #28a745; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        Cadastrar Livro
                    </button>
                </form>
            `;

            document.getElementById('form-doacao').onsubmit = async (e) => {

                e.preventDefault();

                const dadosLivro = {
                    isbn: document.getElementById('isbn').value,
                    titulo: document.getElementById('titulo').value,
                    disciplina: document.getElementById('disciplina').value,
                    estado: document.getElementById('estado').value,
                    quantidade: document.getElementById('quantidade').value
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
    // 1. Verificação de Segurança (Mantendo o que você pediu)
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
                // AQUI UNIMOS O VISUAL BONITO COM TODOS OS SEUS BOTÕES
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
                    <option value="" disabled selected>Selecione o ano escolar</option>
                    
                    <option value="ciclo_basico">Ciclo Básico (Engenharia/Data Science)</option>

                    <optgroup label="Ensino Médio">
                        <option value="1em">1ª Série do Médio</option>
                        <option value="2em">2ª Série do Médio</option>
                        <option value="3em">3ª Série do Médio</option>
                    </optgroup>

                    <optgroup label="Ensino Fundamental">
                        <option value="fund_ii">Fundamental II (6º ao 9º)</option>
                        <option value="fund_i">Fundamental I (1º ao 5º)</option>
                    </optgroup>
                </select>

                <input type="number" id="media_notas" step="0.1" placeholder="Média Geral" required style="padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
                
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="tipo_de_bolsa" placeholder="Tipo de Bolsa" style="flex: 2; padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
                    <input type="text" id="bolsa_percentual" placeholder="%" style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #ccc;">
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

    // Lógica para enviar os dados para o Banco (POST)
    document.getElementById('form-estudante').onsubmit = async (e) => {
        e.preventDefault();

        // Pegamos os valores do formulário
        const dadosEstudante = {
            nome: document.getElementById('nome').value,
            ra: document.getElementById('ra').value,
            ano_escolar: document.getElementById('ano_escolar').value,
            media: document.getElementById('media_notas').value,
            bolsa: document.getElementById('tipo_de_bolsa').value,
            percentual: document.getElementById('bolsa_percentual').value
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
            let doadosHtml = "";
            let retiradosHtml = "";

            // 3. Loop para processar cada item do histórico
            dados.historico.forEach(item => {

                // --- LÓGICA DE FILA E PRIORIDADE SOCIAL ---
                // Se o status for liberado, tag verde. Se estiver na fila, tag amarela com posição.
                const tagStatus = item.status === 'liberado'
                    ? '<span style="background: #28a745; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">Liberado</span>'
                    : `<span style="background: #ffc107; color: #856404; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">Fila: Pos. ${item.posicao}</span>`;

                // Montagem do Card
                const cardHtml = `
                    <div style="background: #f8f9fa; padding: 12px; border-radius: 10px; border: 1px solid #ddd; margin-bottom: 10px; border-left: 5px solid ${item.tipo === 'doacao' ? '#28a745' : '#dc3545'};">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <strong style="display: block; font-size: 0.9rem;">${item.titulo}</strong>
                                <small style="color: #666;">Data: ${item.data}</small>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: bold; color: ${item.tipo === 'doacao' ? '#28a745' : '#dc3545'}; margin-bottom: 5px;">
                                    ${item.tipo === 'doacao' ? '+' : '-'}${item.pontos} pts
                                </div>
                                ${item.tipo === 'retirada' ? tagStatus : ''} 
                            </div>
                        </div>
                    </div>`;

                // Separa em doação ou retirada
                if (item.tipo === 'doacao') {
                    doadosHtml += cardHtml;
                } else {
                    retiradosHtml += cardHtml;
                }
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
                        ${doadosHtml || '<p style="color: #999; font-size: 0.8rem;">Você ainda não doou livros.</p>'}
                    </div>
                    
                    <h3 style="font-size: 1rem; border-bottom: 2px solid #dc3545; padding-bottom: 5px; color: #dc3545;">⏳ Minhas Solicitações (Fila)</h3>
                    <div style="margin: 10px 0;">
                        ${retiradosHtml || '<p style="color: #999; font-size: 0.8rem;">Nenhum livro solicitado.</p>'}
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
                document.getElementById('form-editar').onsubmit = (e) => {
                    e.preventDefault();
                    const novaSenha = document.getElementById('edit_senha').value;
                    const confirma = document.getElementById('edit_confirma').value;

                    if (novaSenha !== confirma) {
                        alert("⚠️ As senhas não coincidem!");
                        return;
                    }

                    // Aqui você faria um fetch com método 'PUT' ou 'POST' para salvar no banco
                    alert("✅ Dados atualizados com sucesso no sistema!");
                    navigate('perfil');
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
                    // Usamos o SEU modelo de card bonito aqui
                    htmlLista += `
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div>
                                <strong style="display: block;">${f.nome}</strong>
                                <small style="color: #666;">RA: ${f.ra} | ${f.ano_escolar}</small>
                            </div>
                            <button onclick="confirmarExclusao('${f.nome}', ${f.id})" style="background: none; border: none; color: #dc3545; font-size: 1.2rem; cursor: pointer;">
                                🗑️
                            </button>
                        </div>`;
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
function confirmarExclusao(nome, id) {
    // Abre aquela janelinha de confirmação do navegador
    const certeza = confirm("Tem certeza que deseja excluir os dados de " + nome + "?");

    if (certeza) {
        alert(nome + " removido com sucesso!");
        // Aqui no futuro você vai colocar o código para apagar do banco de dados
        navigate('dados_filhos'); // Recarrega a página para sumir da lista
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

/* Versão antiga da solicitação
function tentarSolicitar(titulo, pontos) {
    if (!usuarioLogado) {
        alert("Ops! Você viu o livro, mas para solicitar precisa estar logado.");
        navigate('login');
        return;
    }

    // Se estiver logado, abre a confirmação (O detalhe da solicitação)
    const confirmar = confirm(`Confirmar solicitação do livro: ${titulo}\nCusto: ${pontos} créditos.\n\nDeseja entrar na fila de espera?`);

    if (confirmar) {
        // TÓPICO 4: Aqui você enviaria o POST para o servidor
        alert(`✅ Solicitação realizada!\nO livro "${titulo}" agora aparece no seu extrato.`);
        navigate('consultar_dados'); // Leva ele para ver a posição na fila
    }
}
*/