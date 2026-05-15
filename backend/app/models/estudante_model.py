from app import db


class Estudante(db.Model):
    __tablename__ = 'estudantes'

    id = db.Column(db.Integer, primary_key=True)

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey('usuarios.id')
    )

    nome = db.Column(db.String(100), nullable=False)

    ra = db.Column(db.String(30))

    ano_escolar = db.Column(db.String(20))

    media_notas = db.Column(db.Float)

    tipo_bolsa = db.Column(db.String(50))

    bolsa_percentual = db.Column(db.Integer)