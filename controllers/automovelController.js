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
        marcaId,
        modeloId
    } = req.body;

    const file = req.file;
    const imagemPath = file ? file.path : null;


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
            imagem: imagemPath,
            modeloId: modeloId
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

exports.getAutomovelByRenavam = async (req, res) => {

    const renavam = req.params.renavam;

    try {

        const automovel = await Entidade.Automovel.findOne({
            where: {
                renavam: renavam
            }
        });

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

    if (req.file) {
        // Se um novo arquivo existe, adiciona seu caminho aos dados de atualização
        const file = req.file;
        // const imagemPath = file ? file.path : null;

        // updateData.imagem = req.file.path;

        updateData.imagem = file ? file.path : null;
        console.log(`Nova imagem recebida para o automóvel ${id}: ${req.file.path}`);
    }

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

exports.getAllAutomoveisAtivos = async (req, res) => {
    try {
        const automovel = await Entidade.Automovel.findAll({
            where: {
                ativo: true
            },
        });
        res.status(200).send(automovel);
    } catch (err) {
        handleServerError(res, err);
    }
};

exports.getAllAutomoveisInativos = async (req, res) => {
    try {
        const automovel = await Entidade.Automovel.findAll({
            where: {
                ativo: false
            },
        });
        res.status(200).send(automovel);
    } catch (err) {
        handleServerError(res, err);
    }
};

exports.getAutomovelDetalhesById = async (req, res) => {
    const id = req.params.id;

    try {
        // ETAPA 1: Busca a consignação com os dados diretamente relacionados
        const automovel = await Entidade.Automovel.findByPk(id, {
            include: [
                {
                    model: Entidade.Marca,
                    as: 'marca'
                },
                {
                    model: Entidade.Modelo,
                    as: 'modelo'
                }

            ]
        });

        if (!automovel) {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel não encontrado' });
        }

        // ETAPA 2: Busca os modelos da marca encontrada
        // Usamos o marcaId do automóvel que veio na primeira query
        // const marcaIdDoAutomovel = automovel.marcaId;
        // const modelosDaMarca = await Entidade.Modelo.findAll({
        //     where: { id: automovel?.modeloId }
        // });

        // ETAPA 3: Junta os resultados antes de enviar
        // Convertemos o resultado do Sequelize para um objeto simples para poder modificá-lo
        // const detalhesCompletos = automovel.get({ plain: true });

        // Adicionamos a lista de modelos encontrada ao objeto do automóvel
        // detalhesCompletos.modelos = modelosDaMarca; // Usamos 'modelos' (plural)

        return res.status(200).send(automovel);

    } catch (erro) {
        handleServerError(res, erro);
    }
};