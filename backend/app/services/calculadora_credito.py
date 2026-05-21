from datetime import datetime


class CalculadoraCredito:

    @staticmethod
    def calcular(
        estado,
        disciplina,
        origem,
        ano_publicacao,
        ano_escolar,
        edicao
    ):

        pontos = 0


        # ESTADO DO LIVRO
        tabela_estado = {

            'novo': 120,
            'excelente': 100,
            'bom': 70,
            'regular': 40,
            'ruim': 15
        }

        pontos += tabela_estado.get(
            estado.lower(),
            0
        )


        # DISCIPLINAS VALORIZADAS
        disciplinas_valorizadas = [

            'matematica',
            'fisica',
            'quimica',
            'biologia'
        ]

        if disciplina.lower() in disciplinas_valorizadas:

            pontos += 20


        # TIPO DE MATERIAL
        tabela_origem = {

            'didatico': 30,
            'livro_exs': 25,
            'exs_poucas_rasuras': 20,
            'literatura': 15,
            'muitas_rasuras': 5
        }

        pontos += tabela_origem.get(
            origem.lower(),
            0
        )


        # ANO ESCOLAR
        ensino_medio = [
            '1em',
            '2em',
            '3em'
        ]

        ciclo_basico = [
            'ciclo_basico'
        ]

        if ano_escolar in ensino_medio:

            pontos += 20

        elif ano_escolar in ciclo_basico:

            pontos += 15

        else:

            pontos += 5


        # RECÊNCIA DO LIVRO
        ano_atual = datetime.now().year

        idade = ano_atual - int(ano_publicacao)

        if idade <= 1:

            pontos += 30

        elif idade <= 3:

            pontos += 20

        elif idade <= 5:

            pontos += 10


        # EDIÇÃO
        edicao = int(edicao)

        if edicao >= 8:

            pontos += 20

        elif edicao >= 5:

            pontos += 10

        elif edicao >= 3:

            pontos += 5


        # LIMITADOR
        if pontos > 250:

            pontos = 250

        return pontos