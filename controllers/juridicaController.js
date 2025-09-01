const Entidade = require('../models/index');
const { Op } = require("sequelize");


// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllJuridica = async (req, res) => {
    Entidade.Juridica.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};

exports.getJuridicaById = async (req, res) => {

    const id = req.params.id;

    try {
        const juridica = await Entidade.Juridica.findByPk(id);

        if (juridica) {
            return res.status(200).send(juridica);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Cliente não encontrado' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.getJuridicaByCnpj = async (req, res) => {

    const identificacao = req.params.identificacao;

    try {
        const juridica = await Entidade.Juridica.findAll({
            where: {
                cnpj: identificacao
            },
        });

        if (juridica) {
            res.status(200).send(juridica);
        } else {
            return res.status(404).send({ erro: true, mensagemErro: 'Pessoa jurídica não encontrada' });;
        }
    } catch (err) {
        handleServerError(res, err);
    }
};

exports.createJuridica = async (req, res) => {

    const {
        cnpj,
        nome_responsavel,
        razao_social,
        clienteId
    } = req.body;

    const juridica = await Entidade.Juridica.create({
        cnpj: cnpj,
        nome_responsavel: nome_responsavel,
        razao_social: razao_social,
        clienteId: clienteId
    });

    return res.status(201).send(juridica);
};

exports.verificarDuplicidade = async (req, res) => {

    const { cnpj } = req.body;

    const cnpjExistente = await Entidade.Juridica.findOne({
        where: {
            [Op.or]: [{ cnpj }]
        }
    });

    if (cnpjExistente) {
        return res.status(409).send({ erro: true, mensagemErro: 'Já existe um cliente com esse cnpj.' });
    }

    return res.status(200).send({ erro: false });
};