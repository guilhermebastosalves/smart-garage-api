const Entidade = require('../models/index');

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllTrocas = async (req, res) => {
    Entidade.Troca.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};


exports.createTroca = async (req, res) => {

    const {
        comissao,
        data,
        forma_pagamento,
        valor,
        clienteId,
        funcionarioId,
        automovelId,
        automovel_fornecido
    } = req.body;

    const troca = await Entidade.Troca.create({

        comissao: comissao,
        data: data,
        forma_pagamento: forma_pagamento,
        valor: valor,
        clienteId: clienteId,
        funcionarioId: funcionarioId,
        automovelId: automovelId,
        automovel_fornecido: automovel_fornecido
    });

    return res.status(201).send(troca);
};

exports.getTrocaById = async (req, res) => {

    const id = req.params.id;

    try {
        const troca = await Entidade.Troca.findByPk(id);

        if (troca) {
            return res.status(200).send(troca);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel Fornecido não encontrado' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.updateTroca = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Troca.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Troca não encontrada' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};