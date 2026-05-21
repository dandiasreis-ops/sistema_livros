from app import db


class Livro(db.Model):
    __tablename__ = 'livros'

    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))

    isbn = db.Column(db.String(20), primary_key=True)

    titulo = db.Column(db.String(200), nullable=False)

    ano_escolar = db.Column(db.String(20))

    origem_livro = db.Column(db.String(50))

    ano_publicacao = db.Column(db.Integer)

    edicao = db.Column(db.String(20))

    disciplina = db.Column(db.String(100))

    estado = db.Column(db.String(30))

    preco_creditos = db.Column(db.Integer)

    disponivel = db.Column(db.Boolean, default=True)