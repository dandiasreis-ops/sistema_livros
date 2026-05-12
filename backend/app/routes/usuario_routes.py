from flask import Blueprint, request, jsonify
from app import db
from app.models.usuario_model import Usuario

usuario_bp = Blueprint('usuarios', __name__)


# POST - criar usuário
@usuario_bp.route('/api/usuarios', methods=['POST'])
def criar_usuario():

    dados = request.json

    usuario = Usuario(
        nome=dados['nome'],
        email=dados['email'],
        senha_hash=dados['senha'],
        cpf=dados['cpf']
    )

    db.session.add(usuario)
    db.session.commit()

    return jsonify({
        'mensagem': 'Usuário criado com sucesso'
    }), 201


# GET - listar usuários
@usuario_bp.route('/api/usuarios', methods=['GET'])
def listar_usuarios():

    usuarios = Usuario.query.all()

    lista_usuarios = []

    for usuario in usuarios:
        lista_usuarios.append({
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "cpf": usuario.cpf,
            "saldo_creditos": usuario.saldo_creditos
        })

    return jsonify(lista_usuarios)