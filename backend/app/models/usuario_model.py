from app import db


class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha_hash = db.Column(db.Text, nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    saldo_creditos = db.Column(db.Integer, default=0)