from flask import Blueprint, jsonify, request

from app.models.usuario_model import Usuario

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/api/dashboard', methods=['GET'])
def dashboard():

    usuario_id = request.args.get('usuario_id')

    usuario = Usuario.query.get(usuario_id)

    if not usuario:

        return jsonify({
            "erro": "Usuário não encontrado"
        }), 404

    dados = {
        "nome": usuario.nome,
        "pontos_total": usuario.saldo_creditos
    }

    return jsonify(dados)