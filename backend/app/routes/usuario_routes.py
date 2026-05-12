from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from app import db
from app.models.usuario_model import Usuario

usuario_bp = Blueprint('usuarios', __name__)


# POST - criar usuário
@usuario_bp.route('/api/usuarios', methods=['POST'])
def criar_usuario():

    dados = request.json

    # validação básica
    if not dados.get('nome'):
        return jsonify({'erro': 'Nome é obrigatório'}), 400

    if not dados.get('email'):
        return jsonify({'erro': 'Email é obrigatório'}), 400

    if not dados.get('senha'):
        return jsonify({'erro': 'Senha é obrigatória'}), 400

    if not dados.get('cpf'):
        return jsonify({'erro': 'CPF é obrigatório'}), 400

    # verificar email existente
    email_existente = Usuario.query.filter_by(
        email=dados['email']
    ).first()

    if email_existente:
        return jsonify({
            'erro': 'Email já cadastrado'
        }), 400

    # verificar cpf existente
    cpf_existente = Usuario.query.filter_by(
        cpf=dados['cpf']
    ).first()

    if cpf_existente:
        return jsonify({
            'erro': 'CPF já cadastrado'
        }), 400

    usuario = Usuario(
        nome=dados['nome'],
        email=dados['email'],
        cpf=dados['cpf']
    )

    usuario.set_senha(dados['senha'])

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

# LOGIN
@usuario_bp.route('/api/login', methods=['POST'])
def login():

    dados = request.json

    email = dados.get('email')
    senha = dados.get('senha')

    # procurar usuário
    usuario = Usuario.query.filter_by(email=email).first()

    # validar usuário e senha
    if not usuario or not usuario.verificar_senha(senha):

        return jsonify({
            'erro': 'Email ou senha inválidos'
        }), 401

    # gerar token
    token = create_access_token(identity=str(usuario.id))

    return jsonify({
        'mensagem': 'Login realizado com sucesso',
        'token': token,
        'usuario': {
            'id': usuario.id,
            'nome': usuario.nome,
            'email': usuario.email
        }
    })

# ROTA PROTEGIDA
@usuario_bp.route('/api/perfil', methods=['GET'])
@jwt_required()
def perfil():

    # pega id do usuário pelo token
    usuario_id = int(get_jwt_identity())

    usuario = Usuario.query.get(usuario_id)

    if not usuario:
        return jsonify({
            'erro': 'Usuário não encontrado'
        }), 404

    return jsonify({
        'id': usuario.id,
        'nome': usuario.nome,
        'email': usuario.email,
        'saldo_creditos': usuario.saldo_creditos
    })