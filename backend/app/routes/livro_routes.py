from flask import Blueprint, jsonify
from app.models.livro_model import Livro

livro_bp = Blueprint('livros', __name__)


@livro_bp.route('/api/livros', methods=['GET'])
def listar_livros():

    livros = Livro.query.all()

    lista = []

    for livro in livros:

        lista.append({
            "isbn": livro.isbn,
            "titulo": livro.titulo,
            "pontos": livro.preco_creditos,
            "disciplina": livro.disciplina,
            "quantidade": livro.quantidade
        })

    return jsonify(lista)