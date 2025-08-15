const { where } = require("sequelize");
const Entidade = require("../models/index");
const { Op } = require("sequelize");
const { response } = require("express");

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};


exports.getAllAutomoveis = async (req, res) => {
    Entidade.Automovel.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
}

exports.createAutomovel = async (req, res) => {

    const {
        ano_fabricacao,
        ano_modelo,
        ativo,
        cor,
        combustivel,
        km,
        origem,
        placa,
        renavam,
        valor,
        marcaId
    } = req.body;

    const file = req.file;
    const imagemPath = file ? file.path : null;

    console.log(file);

    try {
        const automovel = await Entidade.Automovel.create({

            ano_fabricacao: ano_fabricacao,
            ano_modelo: ano_modelo,
            ativo: ativo,
            cor: cor,
            combustivel: combustivel,
            km: km,
            origem: origem,
            placa: placa,
            renavam: renavam,
            valor: valor,
            marcaId: marcaId,
            imagem: imagemPath
        });

        return res.status(201).send(automovel);
    } catch (error) {
        console.error("Erro ao criar automóvel:", error);
        return res.status(500).send({ erro: true, mensagemErro: "Erro ao cadastrar automóvel" });
    }


}

exports.verificarDuplicidade = async (req, res) => {

    const { placa, renavam } = req.body;

    const placaExistente = await Entidade.Automovel.findOne({
        where: {
            [Op.or]: [{ placa }]
        }
    });

    const renavamExistente = await Entidade.Automovel.findOne({
        where: {
            [Op.or]: [{ renavam }]
        }
    });

    if (placaExistente) {
        return res.status(409).send({ erro: true, mensagemErro: 'Já existe um automóvel com essa placa.' });
    }

    if (renavamExistente) {
        return res.status(409).send({ erro: true, mensagemErro: 'Já existe um automóvel com esse renavam.' });
    }

    return res.status(200).send({ erro: false });
};

exports.getAutomovelById = async (req, res) => {

    const id = req.params.id;

    try {
        const automovel = await Entidade.Automovel.findByPk(id);

        if (automovel) {
            return res.status(200).send(automovel);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel não encontrado' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.updateAutomovel = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Automovel.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel não encontrado' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};