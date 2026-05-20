# POR ENQUANTO, NÃO ESTÁ SENDO REALMENTE UTILIZADO
# VAMOS UTILIZAR PARA MANTER UM LOG FINANCEIRO AUXILIAR

from app import db


class Historico(db.Model):

    __tablename__ = 'historico'

    id = db.Column(db.Integer, primary_key=True)

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey('usuarios.id')
    )

    tipo_transacao = db.Column(db.String(50))

    valor = db.Column(db.Integer)

    data_transacao = db.Column(
        db.DateTime,
        default=db.func.current_timestamp()
    )