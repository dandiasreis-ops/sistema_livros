class CalculadoraCredito:

    @staticmethod
    def calcular(estado_livro):

        tabela = {
            'excelente': 100,
            'bom': 70,
            'regular': 40
        }

        return tabela.get(estado_livro.lower(), 0)