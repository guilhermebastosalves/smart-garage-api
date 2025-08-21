const Entidade = require('../models/index');
const { Op } = require("sequelize");

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllFisica = async (req, res) => {
    Entidade.Fisica.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};

exports.getFisicaById = async (req, res) => {

    const id = req.params.id;

    try {
        const fisica = await Entidade.Fisica.findByPk(id);

        if (fisica) {
            return res.status(200).send(fisica);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Cliente não encontrado' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.getFisicaByCpf = async (req, res) => {

    const identificacao = req.params.identificacao;

    try {
        const fisica = await Entidade.Fisica.findAll({
            where: {
                cpf: identificacao
            },
        });

        if (fisica) {
            res.status(200).send(fisica);
        } else {
            return res.status(404).send({ erro: true, mensagemErro: 'Pessoa física não encontrada' });;
        }
    } catch (err) {
        handleServerError(res, err);
    }
};


exports.createFisica = async (req, res) => {

    var cpf = req.body.cpf;
    var rg = req.body.rg;
    var clienteId = req.body.clienteId;


    try {
        const fisica = await Entidade.Fisica.create({

            cpf: cpf,
            rg: rg,
            clienteId: clienteId
        });

        return res.status(201).send(fisica);

    } catch (error) {
        console.error("Erro ao cadastrar pesso física:", error);
        return res.status(500).send({ erro: true, mensagemErro: "Erro ao cadastrar pessoa física" });
    }


};

exports.verificarDuplicidade = async (req, res) => {

    const { rg, cpf } = req.body;

    const rgExistente = await Entidade.Fisica.findOne({
        where: {
            [Op.or]: [{ rg }]
        }
    });

    const cpfExistente = await Entidade.Fisica.findOne({
        where: {
            [Op.or]: [{ cpf }]
        }
    });

    if (rgExistente) {
        return res.status(409).send({ erro: true, mensagemErro: 'Já existe um cliente com esse rg.' });
    }

    if (cpfExistente) {
        return res.status(409).send({ erro: true, mensagemErro: 'Já existe um cliente com esse cpf.' });
    }

    return res.status(200).send({ erro: false });
};