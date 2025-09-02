const Entidade = require('../models/index');
const { Op } = require("sequelize");


// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllClientes = async (req, res) => {
    Entidade.Cliente.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};

exports.getClienteById = async (req, res) => {

    const id = req.params.id;

    try {
        const cliente = await Entidade.Cliente.findByPk(id);

        if (cliente) {
            return res.status(200).send(cliente);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Cliente não encontrado' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};


exports.createCliente = async (req, res) => {

    // var data_cadastro = req.body.data_cadastro;
    // var email = req.body.email;
    // // var ativo = req.body.ativo;
    // var nome = req.body.nome;
    // var telefone = req.body.telefone;

    const {
        data_cadastro,
        email,
        nome,
        telefone
    } = req.body

    try {

        const cliente = await Entidade.Cliente.create({

            data_cadastro: data_cadastro,
            email: email,
            ativo: true,
            nome: nome,
            telefone: telefone
        });

        return res.status(201).send(cliente);
    } catch (erro) {
        handleServerError(res, erro)
    }
};

exports.verificarDuplicidade = async (req, res) => {

    const { email } = req.body;

    const emailExistente = await Entidade.Cliente.findOne({
        where: {
            [Op.or]: [{ email }]
        }
    });

    if (emailExistente) {
        return res.status(409).send({ erro: true, mensagemErro: 'Já existe um cliente com esse email.' });
    }



    return res.status(200).send({ erro: false });
};