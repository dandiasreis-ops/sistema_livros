class CalculadoraPrioridade:

    @staticmethod
    def calcular(estudante):

        prioridade = 0

        if estudante.tipo_bolsa == 'integral':
            prioridade += 50

        prioridade += estudante.media_notas * 5

        return prioridade