from app import db


class Retirada(db.Model):

    __tablename__ = 'retiradas'

    id = db.Column(db.Integer, primary_key=True)

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey('usuarios.id'),
        nullable=False
    )

    isbn = db.Column(
        db.String(20),
        db.ForeignKey('livros.isbn'),
        nullable=False
    )

    data_retirada = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    creditos_utilizados = db.Column(
        db.Integer,
        nullable=False
    )

    prioridade = db.Column(
        db.Integer, 
        default=0
    )

    status = db.Column(
        db.String(30),
        default='fila'
    )