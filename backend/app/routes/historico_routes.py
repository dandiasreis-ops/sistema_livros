from flask import Blueprint, jsonify, request

from app.models.usuario_model import Usuario
from app.models.retirada_model import Retirada
#from app.models.doacao_model import Doacao
from app.models.livro_model import Livro


historico_bp = Blueprint('historico', __name__)


@historico_bp.route('/api/extrato', methods=['GET'])
def obter_extrato():

    usuario_id = request.args.get('usuario_id')

    usuario = Usuario.query.get(usuario_id)

    if not usuario:

        return jsonify({
            "erro": "Usuário não encontrado"
        }), 404

    historico = []

    # RETIRADAS
    retiradas = Retirada.query.filter_by(
        usuario_id=usuario_id
    ).all()

    for retirada in retiradas:

        livro = Livro.query.get(retirada.isbn)

        fila = Retirada.query.filter_by(
            isbn=retirada.isbn
        ).order_by(Retirada.data_retirada.asc()).all()

        posicao = 1

        for item in fila:
            if item.usuario_id == retirada.usuario_id:
                break
            posicao += 1

        historico.append({
            "tipo": "retirada",
            "titulo": livro.titulo if livro else "Livro",
            "pontos": retirada.creditos_utilizados,
            "status": retirada.status,
            "data": retirada.data_retirada.strftime("%d/%m/%Y"),
            "posicao": posicao
        })

    return jsonify({
        "pontos_total": usuario.saldo_creditos,
        "historico": historico
    })

'''
    # DOAÇÕES
    doacoes = Doacao.query.filter_by(
        usuario_id=usuario_id
    ).all()

    for doacao in doacoes:

        livro = Livro.query.get(doacao.isbn)

        historico.append({
            "tipo": "doacao",
            "titulo": livro.titulo if livro else "Livro",
            "pontos": doacao.creditos_gerados,
            "status": "concluido",
            "data": doacao.data_doacao.strftime("%d/%m/%Y")
        })
'''