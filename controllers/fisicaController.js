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

    const rgParaSalvar = rg ? rg : null;


    try {
        const fisica = await Entidade.Fisica.create({

            cpf: cpf,
            rg: rgParaSalvar,
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

    try {
        const condicoes = [];

        // Adiciona a condição do CPF somente se ele foi enviado
        if (cpf) {
            condicoes.push({ cpf: cpf });
        }

        // Adiciona a condição do RG somente se ele foi enviado
        if (rg) {
            condicoes.push({ rg: rg });
        }

        // Se nenhum dado foi enviado, não há o que verificar
        if (condicoes.length === 0) {
            return res.status(200).send({ erro: false });
        }

        // Executa a busca com as condições válidas
        const existente = await Entidade.Fisica.findOne({
            where: {
                [Op.or]: condicoes
            }
        });

        if (existente) {
            // Descobre qual campo causou a duplicidade para uma mensagem clara
            const campo = existente.cpf === cpf ? 'CPF' : 'RG';
            return res.status(409).send({ erro: true, mensagemErro: `Já existe um cliente com este ${campo}.` });
        }

        return res.status(200).send({ erro: false });

    } catch (error) {
        handleServerError(res, error);
    }
};