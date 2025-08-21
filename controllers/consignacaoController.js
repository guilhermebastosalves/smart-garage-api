const Entidade = require('../models/index');
const { Op, where } = require('sequelize');

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllConsignacoes = async (req, res) => {
    Entidade.Consignacao.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};


exports.createConsignacao = async (req, res) => {

    const {
        data_inicio,
        data_fim,
        ativo,
        valor,
        funcionarioId,
        automovelId,
        clienteId
    } = req.body;

    const consignacao = await Entidade.Consignacao.create({

        data_inicio: data_inicio,
        data_fim: data_fim,
        ativo: ativo,
        valor: valor,
        funcionarioId: funcionarioId,
        automovelId: automovelId,
        clienteId: clienteId
    });

    return res.status(201).send(consignacao);
}

exports.getAllConsignacoesOrderByData = async (req, res) => {
    Entidade.Consignacao.findAll({
        where: {
            ativo: true,
        },
        order: [
            ["data_inicio", "DESC"]
        ]
    }).then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};

exports.getConsignacaoById = async (req, res) => {

    const id = req.params.id;

    try {
        const consignacao = await Entidade.Consignacao.findByPk(id);

        if (consignacao) {
            return res.status(200).send(consignacao);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Consignação não encontrada' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.getConsignacaoByAutomovel = async (req, res) => {

    const automovelId = req.params.automovelId;

    try {

        const consignacao = await Entidade.Consignacao.findOne({
            where: {
                ativo: true,
                automovelId: automovelId
            }
        });

        if (consignacao) {
            return res.status(200).send(consignacao);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Consignação não encontrada' })
        }

    } catch (erro) {
        handleServerError(res, erro)
    }
};

exports.updateConsignacao = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Consignacao.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Consignação não encontrada' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};

exports.getAllConsignacoesAtivas = async (req, res) => {
    try {
        const consignacoes = await Entidade.Consignacao.findAll({
            where: {
                ativo: true
            },
        });
        res.status(200).send(consignacoes);
    } catch (err) {
        handleServerError(res, err);
    }
};