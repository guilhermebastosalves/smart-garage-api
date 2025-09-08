const Entidade = require('../models/index');
const { Op } = require("sequelize");

// Exemplo de controller no backend
exports.gerarRelatorio = async (req, res) => {
    const { tipo, dataInicio, dataFim } = req.query;

    let EntidadeSelecionada;
    let includeOptions = []; // Array para as associações (include)
    let dateColumnName; // Nome da coluna de data a ser filtrada


    // Seleciona o Model do Sequelize com base no tipo
    switch (tipo) {
        case 'Venda':
            EntidadeSelecionada = Entidade.Venda;
            dateColumnName = 'data'; // Venda usa a coluna 'data'
            // Venda se relaciona com Automovel e Cliente
            includeOptions.push(
                { model: Entidade.Automovel, as: "automovel" },
                { model: Entidade.Cliente, as: "cliente" }
            );
            break;
        case 'Compra':
            EntidadeSelecionada = Entidade.Compra;
            dateColumnName = 'data'; // Venda usa a coluna 'data'
            // Venda se relaciona com Automovel e Cliente
            includeOptions.push(
                { model: Entidade.Automovel, as: "automovel" },
                { model: Entidade.Cliente, as: "cliente" }
            );
            break;
        case 'Troca':
            EntidadeSelecionada = Entidade.Troca;
            dateColumnName = 'data'; // Troca usa a coluna 'data'
            // Troca se relaciona com Automovel e Cliente
            includeOptions.push(
                { model: Entidade.Automovel, as: "automovel" },
                { model: Entidade.Cliente, as: "cliente" }
            );
            break;
        case 'Gasto':
            EntidadeSelecionada = Entidade.Gasto;
            dateColumnName = 'data'; // Gasto usa a coluna 'data'
            // Gasto se relaciona apenas com Automovel
            includeOptions.push({ model: Entidade.Automovel, as: "automovel" });
            break;
        case 'Consignacao':
            EntidadeSelecionada = Entidade.Consignacao;
            dateColumnName = 'data_inicio'; // Consignacao usa 'data_inicio'
            // Consignacao se relaciona com Automovel e Cliente
            includeOptions.push(
                { model: Entidade.Automovel, as: "automovel" },
                { model: Entidade.Cliente, as: "cliente" }
            );
            break;
        case 'Manutencao':
            EntidadeSelecionada = Entidade.Manutencao;
            dateColumnName = 'data_envio'; // Manutencao usará 'data_envio' para o filtro
            // Manutencao se relaciona apenas com Automovel
            includeOptions.push({ model: Entidade.Automovel, as: "automovel" });
            break;
        default:
            return res.status(400).send({ mensagem: "Tipo de relatório inválido." });
    }

    try {
        // Objeto de opções da query que será montado dinamicamente
        const queryOptions = {
            where: {
                // Usa a variável com o nome da coluna correta
                [dateColumnName]: {
                    [Op.between]: [new Date(dataInicio), new Date(dataFim)]
                }
            },
            // Usa o array de includes que foi configurado no switch
            include: includeOptions
        };

        const dados = await EntidadeSelecionada.findAll(queryOptions);
        res.status(200).send(dados);
    } catch (error) {
        console.error("Erro detalhado ao gerar relatório:", error); // Log detalhado no servidor
        res.status(500).send({ mensagem: "Erro ao gerar relatório.", error: error.message });
    }
};