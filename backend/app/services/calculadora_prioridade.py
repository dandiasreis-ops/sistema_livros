class CalculadoraPrioridade:

    @staticmethod
    def calcular(estudante, usuario, total_doacoes):

        prioridade = 0

        if estudante:

            # BOLSA
            tipo = estudante.tipo_bolsa
            percentual = estudante.bolsa_percentual

            if tipo == 'social':

                prioridade += 30

                if percentual == 100:
                    prioridade += 25

                elif percentual >= 50:
                    prioridade += 15

            elif tipo == 'merito':

                prioridade += 15

                if percentual == 100:
                    prioridade += 15

                elif percentual >= 50:
                    prioridade += 10


            # MÉDIA ESCOLAR
            media = estudante.media_notas or 0

            if media >= 9:

                prioridade += 25

            elif media >= 8:

                prioridade += 18

            elif media >= 7:

                prioridade += 10

            elif media >= 6:

                prioridade += 5


            # ANO ESCOLAR
            ensino_medio = [
                '1em',
                '2em',
                '3em'
            ]

            fund_i = [
                '1fi',
                '2fi',
                '3fi',
                '4fi',
                '5fi',
            ]

            fund_ii = [
                '6fii',
                '7fii',
                '8fii',
                '9fii',
            ]

            if estudante.ano_escolar in ensino_medio:

                prioridade += 12

            elif estudante.ano_escolar in fund_ii:

                prioridade += 10

            elif estudante.ano_escolar in fund_i:

                prioridade += 8

            else:

                prioridade += 6


        # CONTRIBUIÇÃO
        prioridade += total_doacoes * 4

        # BONUS DE PARTICIPAÇÃO

        if total_doacoes >= 5:

            prioridade += 10

        if total_doacoes >= 10:

            prioridade += 20

        if total_doacoes >= 20:

            prioridade += 30


        # BALANCEAMENTO SOCIAL
        saldo = usuario.saldo_creditos

        if saldo < 20:

            prioridade += 20

        elif saldo < 50:

            prioridade += 10

        return prioridade