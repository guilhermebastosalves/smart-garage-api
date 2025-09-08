// Exemplo de controller no backend
exports.gerarRelatorio = async (req, res) => {
    const { tipo, dataInicio, dataFim } = req.query;
    let Entidade;

    // Seleciona o Model do Sequelize com base no tipo
    switch (tipo) {
        case 'Venda':
            Entidade = require('../models').Venda;
            break;
        case 'Troca':
            Entidade = require('../models').Troca;
            break;
        // ... outros casos: Gasto, Consignacao, Manutencao
        default:
            return res.status(400).send({ mensagem: "Tipo de relatório inválido." });
    }

    try {
        const dados = await Entidade.findAll({
            where: {
                data: { // ou a coluna de data correspondente de cada tabela
                    [Op.between]: [new Date(dataInicio), new Date(dataFim)]
                }
            },
            // Inclua associações se precisar de dados do cliente, automóvel, etc.
            // include: [{ model: Automovel }, { model: Cliente }]
        });
        res.status(200).send(dados);
    } catch (error) {
        res.status(500).send({ mensagem: "Erro ao gerar relatório.", error });
    }
};