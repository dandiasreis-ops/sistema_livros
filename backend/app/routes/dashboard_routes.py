from flask import Blueprint, jsonify

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard', methods=['GET'])
def dashboard():

    dados = {
        "nome": "Daniel",
        "pontos_total": 120
    }

    return jsonify(dados)

@dashboard_bp.route('/api/extrato', methods=['GET'])
def extrato():

    dados = {
        "pontos_total": 120,
        "historico": [
            {
                "titulo": "Cálculo I",
                "tipo": "doacao",
                "pontos": 30,
                "data": "10/05/2026"
            },
            {
                "titulo": "Física Geral",
                "tipo": "retirada",
                "pontos": 25,
                "data": "11/05/2026",
                "status": "fila",
                "posicao": 2
            }
        ]
    }

    return jsonify(dados)