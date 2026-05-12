from app import db
from bcrypt import hashpw, gensalt, checkpw


class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(100),
                      unique=True,
                      nullable=False)

    senha_hash = db.Column(db.Text, nullable=False)

    cpf = db.Column(db.String(14),
                    unique=True,
                    nullable=False)

    saldo_creditos = db.Column(db.Integer, default=0)

    # gerar hash da senha
    def set_senha(self, senha):
        self.senha_hash = hashpw(
            senha.encode('utf-8'),
            gensalt()
        ).decode('utf-8')

    # verificar senha
    def verificar_senha(self, senha):
        return checkpw(
            senha.encode('utf-8'),
            self.senha_hash.encode('utf-8')
        )