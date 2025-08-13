const Entidade = require('../models/index');

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


exports.createCliente = async (req, res) => {

    var data_cadastro = req.body.data_cadastro;
    var email = req.body.email;
    var ativo = req.body.ativo;
    var nome = req.body.nome;
    var telefone = req.body.telefone;

    const cliente = await Entidade.Cliente.create({

        data_cadastro: data_cadastro,
        email: email,
        ativo: ativo,
        nome: nome,
        telefone: telefone
    });

    return res.status(201).send(cliente);
};