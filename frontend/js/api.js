// js/api.js
const API_URL = "http://127.0.0.1:5000"; // Aqui vai o endereço do seu Flask

const ApiService = {
    // Função para buscar dados (ex: lista de livros)
    async buscarLivros() {
        try {
            const resposta = await fetch(`${API_URL}/api/livros`);
            if (!resposta.ok) throw new Error("Erro ao buscar livros");
            return await resposta.json();
        } catch (erro) {
            console.error("Erro na API:", erro);
            return []; // Retorna lista vazia se der erro
        }
    },

    // Função para enviar dados (ex: nova doação)
    async enviarDoacao(dados) {
        try {
            const resposta = await fetch(`${API_URL}/api/doacoes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
            return await resposta.json();
        } catch (erro) {
            console.error("Erro ao enviar doação:", erro);
        }
    }
};