from flask import Blueprint, jsonify, request

from app import db
from app.models.livro_model import Livro
from app.services.calculadora_credito import CalculadoraCredito

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

@livro_bp.route('/api/livros', methods=['POST'])
def cadastrar_livro():

    dados = request.json

    creditos = CalculadoraCredito.calcular(
        dados.get('estado')
    )

    livro = Livro(
        isbn=dados.get('isbn'),
        titulo=dados.get('titulo'),
        disciplina=dados.get('disciplina'),
        estado=dados.get('estado'),
        preco_creditos=creditos,
        quantidade=dados.get('quantidade')
    )

    db.session.add(livro)
    db.session.commit()

    return jsonify({
        "mensagem": "Livro cadastrado com sucesso"
    }), 201