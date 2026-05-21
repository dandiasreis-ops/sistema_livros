from flask import Blueprint, jsonify, request

from app import db
from app.models.estudante_model import Estudante
from app.services.calculadora_prioridade import CalculadoraPrioridade
from app.models.usuario_model import Usuario
from app.models.livro_model import Livro

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

        usuario = Usuario.query.get(usuario_id)

        total_doacoes = Livro.query.filter_by(
            usuario_id=usuario_id
        ).count()

        prioridade = CalculadoraPrioridade.calcular(
            filho,
            usuario,
            total_doacoes
        )

        lista.append({
            "id": filho.id,
            "nome": filho.nome,
            "ra": filho.ra,
            "ano_escolar": filho.ano_escolar,
            "media_notas": filho.media_notas,
            "tipo_bolsa": filho.tipo_bolsa,
            "bolsa_percentual": filho.bolsa_percentual,
            "prioridade": prioridade
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
        media_notas=dados.get('media_notas'),
        tipo_bolsa=dados.get('tipo_bolsa'),
        bolsa_percentual=dados.get('bolsa_percentual')
    )

    db.session.add(estudante)
    db.session.commit()

    return jsonify({
        "mensagem": "Estudante cadastrado com sucesso"
    }), 201

# REMOVER ESTUDANTE
@filho_bp.route('/api/estudantes/<int:id>', methods=['DELETE'])
def remover_estudante(id):

    estudante = Estudante.query.get(id)

    if not estudante:
        return jsonify({
            "erro": "Estudante não encontrado"
        }), 404

    db.session.delete(estudante)
    db.session.commit()

    return jsonify({
        "mensagem": "Estudante removido com sucesso"
    })