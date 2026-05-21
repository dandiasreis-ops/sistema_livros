from flask import Blueprint, jsonify, request

from app.models.usuario_model import Usuario
from app.models.retirada_model import Retirada
from app.models.livro_model import Livro

historico_bp = Blueprint('historico', __name__)


@historico_bp.route('/api/extrato', methods=['GET'])
def obter_extrato():

    usuario_id = request.args.get('usuario_id')

    usuario = Usuario.query.get(usuario_id)

    doacoes = Livro.query.filter_by(usuario_id=usuario_id).all()

    lista_doacoes = []

    for livro in doacoes:
        lista_doacoes.append({
            "titulo": livro.titulo,
            "pontos": livro.preco_creditos
        })

    if not usuario:

        return jsonify({
            "erro": "Usuário não encontrado"
        }), 404

    fila = []
    liberados = []
    concluidos = []

    retiradas = Retirada.query.filter_by(
        usuario_id=usuario_id
    ).all()

    for retirada in retiradas:

        livro = Livro.query.get(retirada.isbn)

        fila_livro = Retirada.query.filter_by(
            isbn=retirada.isbn,
            status='fila'
        ).order_by(
            Retirada.prioridade.desc(),
            Retirada.data_retirada.asc()
        ).all()

        posicao = 1

        for item_fila in fila_livro:

            if item_fila.usuario_id == retirada.usuario_id:
                break

            posicao += 1

        item_historico = {
            "tipo": "retirada",
            "titulo": livro.titulo if livro else "Livro",
            "pontos": retirada.creditos_utilizados,
            "status": retirada.status,
            "data": retirada.data_retirada.strftime("%d/%m/%Y"),
            "posicao": posicao
        }

        if retirada.status == "fila":
            fila.append(item_historico)

        elif retirada.status == "liberado":
            liberados.append(item_historico)

        elif retirada.status == "concluido":
            concluidos.append(item_historico)

    return jsonify({
        "pontos_total": usuario.saldo_creditos,
        "fila": fila,
        "liberados": liberados,
        "concluidos": concluidos,
        "doacoes": lista_doacoes
    })