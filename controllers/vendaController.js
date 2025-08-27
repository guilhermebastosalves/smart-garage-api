const Entidade = require("../models/index");

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllVendas = async (req, res) => {
    try {
        Entidade.Venda.findAll().then((values) => {
            res.status(200).send(values)
        })
    } catch (err) {
        handleServerError(res, err)
    }
};

exports.createVenda = async (req, res) => {
    try {

        const {
            data,
            forma_pagamento,
            valor,
            comissao,
            automovelId,
            clienteId,
            funcionarioId
        } = req.body;

        const venda = await Entidade.Venda.create({

            data: data,
            forma_pagamento: forma_pagamento,
            comissao: comissao,
            valor: valor,
            funcionarioId: funcionarioId,
            automovelId: automovelId,
            clienteId: clienteId
        });

        return res.status(201).send(venda);

    } catch (err) {
        handleServerError(res, err)
    }
};

exports.getAllVendasOrderByData = async (req, res) => {
    Entidade.Venda.findAll({
        order: [
            ["data", "DESC"]
        ]
    }).then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};

exports.getVendaById = async (req, res) => {

    const id = req.params.id;

    try {
        const venda = await Entidade.Venda.findByPk(id);

        if (venda) {
            return res.status(200).send(venda);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Venda não encontrada' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};


exports.updateVenda = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Venda.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Venda não encontrada' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};