// Em controllers/comissaoController.js
const Entidade = require('../models/index');
const { sequelize } = require('../db');

// Busca todas as faixas de comissão
exports.getAll = async (req, res) => {
    try {
        const faixas = await Entidade.Comissao.findAll({ order: [['valor_minimo', 'ASC']] });
        res.status(200).send(faixas);
    } catch (error) {
        res.status(500).send({ mensagem: "Erro ao buscar faixas de comissão." });
    }
};

// Atualiza todas as faixas de comissão de uma vez
exports.updateAll = async (req, res) => {
    const novasFaixas = req.body; // Espera um array de objetos de faixa
    const t = await sequelize.transaction();
    try {
        // Apaga todas as regras antigas
        await Entidade.Comissao.destroy({ where: {}, transaction: t });

        // Insere as novas regras
        await Entidade.Comissao.bulkCreate(novasFaixas, { transaction: t });

        await t.commit();
        res.status(200).send({ mensagem: "Regras de comissão atualizadas com sucesso!" });
    } catch (error) {
        await t.rollback();
        console.error("Erro detalhado ao atualizar comissões:", error);
        res.status(500).send({ mensagem: "Erro ao atualizar faixas de comissão." })
    }
};