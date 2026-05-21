from flask import Blueprint, jsonify, request

from app import db
from app.models.livro_model import Livro
from app.services.calculadora_credito import CalculadoraCredito
from app.models.usuario_model import Usuario

livro_bp = Blueprint('livros', __name__)


@livro_bp.route('/api/livros', methods=['GET'])
def listar_livros():

    livros = Livro.query.filter_by(
        disponivel=True
    ).all()

    lista = []

    for livro in livros:

        lista.append({
            "isbn": livro.isbn,
            "titulo": livro.titulo,
            "pontos": livro.preco_creditos,
            "disciplina": livro.disciplina,
            "estado": livro.estado,
            "ano_escolar": livro.ano_escolar,
            "origem_livro": livro.origem_livro,
            "ano_publicacao": livro.ano_publicacao,
            "edicao": livro.edicao
        })

    return jsonify(lista)

@livro_bp.route('/api/livros', methods=['POST'])
def cadastrar_livro():

    dados = request.json

    creditos = CalculadoraCredito.calcular(
        dados.get('estado'),
        dados.get('disciplina'),
        dados.get('origem_livro'),
        dados.get('ano_publicacao'),
        dados.get('ano_escolar'),
        dados.get('edicao')
    )

    livro = Livro(
        usuario_id=dados.get('usuario_id'),
        isbn=dados.get('isbn'),
        titulo=dados.get('titulo'),
        ano_escolar=dados.get('ano_escolar'),
        origem_livro=dados.get('origem_livro'),
        ano_publicacao=dados.get('ano_publicacao'),
        edicao=dados.get('edicao'),
        disciplina=dados.get('disciplina'),
        estado=dados.get('estado'),
        preco_creditos=creditos
    )

    usuario = Usuario.query.get(
        dados.get('usuario_id')
    )

    if usuario:
        usuario.saldo_creditos += creditos

    db.session.add(livro)
    db.session.commit()

    return jsonify({
        "mensagem": "Livro cadastrado com sucesso"
    }), 201