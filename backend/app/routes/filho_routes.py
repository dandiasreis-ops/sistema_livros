from flask import Blueprint, jsonify, request

from app import db
from app.models.estudante_model import Estudante

filho_bp = Blueprint('filhos', __name__)


# LISTAR FILHOS
@filho_bp.route('/api/filhos', methods=['GET'])
def listar_filhos():

    usuario_id = int(request.args.get('usuario_id'))

    filhos = Estudante.query.filter_by(
        usuario_id=usuario_id
    ).all()

    lista = []

    for filho in filhos:

        lista.append({
            "id": filho.id,
            "nome": filho.nome,
            "ra": filho.ra,
            "ano_escolar": filho.ano_escolar
        })

    return jsonify(lista)


# CADASTRAR ESTUDANTE
@filho_bp.route('/api/estudantes', methods=['POST'])
def cadastrar_estudante():

    dados = request.json

    estudante = Estudante(
        usuario_id=dados.get('usuario_id'),
        nome=dados.get('nome'),
        ra=dados.get('ra'),
        ano_escolar=dados.get('ano_escolar'),
        media_notas=dados.get('media'),
        tipo_bolsa=dados.get('bolsa'),
        bolsa_percentual=dados.get('percentual')
    )

    db.session.add(estudante)
    db.session.commit()

    return jsonify({
        "mensagem": "Estudante cadastrado com sucesso"
    }), 201