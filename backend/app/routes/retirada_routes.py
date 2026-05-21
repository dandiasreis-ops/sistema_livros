from flask import Blueprint, jsonify, request

from app import db

from app.models.retirada_model import Retirada
from app.models.livro_model import Livro
from app.models.usuario_model import Usuario
from app.models.historico_model import Historico
from app.models.estudante_model import Estudante
from app.services.calculadora_prioridade import CalculadoraPrioridade


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
    
    if not livro.disponivel:
        return jsonify({
            "erro": "Livro indisponível"
        }), 400
    
    estudante = Estudante.query.filter_by(
        usuario_id=usuario_id
    ).first()

    doacoes = Livro.query.filter_by(
        usuario_id=usuario_id
    ).all()

    total_doacoes = len(doacoes)

    prioridade = CalculadoraPrioridade.calcular(
        estudante,
        usuario,
        total_doacoes
    )

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
        prioridade=prioridade,
        status='fila'
    )

    db.session.add(retirada)

    db.session.commit()

    return jsonify({
        "mensagem": "Solicitação realizada com sucesso"
    }), 201


@retirada_bp.route('/api/liberar_retirada/<int:id>', methods=['PUT'])
def liberar_retirada(id):

    retirada = Retirada.query.get(id)

    if not retirada:

        return jsonify({
            "erro": "Retirada não encontrada"
        }), 404

    retirada.status = "liberado"

    livro = Livro.query.get(
        retirada.isbn
    )

    if livro:
        livro.disponivel = False

    db.session.commit()

    return jsonify({
        "mensagem": "Livro liberado para retirada"
    })


@retirada_bp.route('/api/concluir_retirada/<int:id>', methods=['PUT'])
def concluir_retirada(id):

    retirada = Retirada.query.get(id)

    if not retirada:

        return jsonify({
            "erro": "Retirada não encontrada"
        }), 404

    retirada.status = "concluido"

    db.session.commit()

    return jsonify({
        "mensagem": "Retirada concluída"
    })