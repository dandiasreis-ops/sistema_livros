from app import db


class Livro(db.Model):
    __tablename__ = 'livros'

    isbn = db.Column(db.String(20), primary_key=True)

    titulo = db.Column(db.String(200), nullable=False)

    disciplina = db.Column(db.String(100))

    estado = db.Column(db.String(30))

    preco_creditos = db.Column(db.Integer)

    quantidade = db.Column(db.Integer, default=1)