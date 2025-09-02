const { where } = require('sequelize');
const Entidade = require('../models/index');

exports.findByFuncionarioid = async (req, res) => {

    const { funcionarioId } = req.params.funcionarioId;

    const vendedor = await Entidade.Vendedor.findOne({
        where: {
            funcionarioId: funcionarioId
        }
    });

    if (!vendedor) {
        return res.status(404).send({ erro: true, mensagemErro: 'Vendedor não encontrado' });
    }

    return res.status(201).send(gerente);
}