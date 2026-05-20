from flask import Blueprint, jsonify, request

from app import db

from app.models.retirada_model import Retirada
from app.models.livro_model import Livro
from app.models.usuario_model import Usuario
from app.models.historico_model import Historico


retirada_bp = Blueprint('retiradas', __name__)


@retirada_bp.route('/api/retiradas', methods=['POST'])
def solicitar_livro():

    dados = request.json

    usuario_id = dados.get('usuario_id')
    isbn = dados.get('isbn')

    usuario = Usuario.query.get(usuario_id)

    if not usuario:
        return jsonify({
            "erro": "Usuário não encontrado"
        }), 404

    livro = Livro.query.get(isbn)

    if not livro:
        return jsonify({
            "erro": "Livro não encontrado"
        }), 404

    # Verifica saldo
    if usuario.saldo_creditos < livro.preco_creditos:

        return jsonify({
            "erro": "Créditos insuficientes"
        }), 400

    # Desconta créditos
    usuario.saldo_creditos -= livro.preco_creditos

    novo_historico = Historico(
    usuario_id=usuario.id,
    tipo_transacao="retirada",
    valor=livro.preco_creditos
    )

    db.session.add(novo_historico)

    retirada = Retirada(
        usuario_id=usuario_id,
        isbn=isbn,
        creditos_utilizados=livro.preco_creditos,
        status='fila'
    )

    db.session.add(retirada)

    db.session.commit()

    return jsonify({
        "mensagem": "Solicitação realizada com sucesso"
    }), 201