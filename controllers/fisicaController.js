const Entidade = require('../models/index');

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


exports.createFisica = async (req, res) => {

    var cpf = req.body.cpf;
    var rg = req.body.rg;
    var clienteId = req.body.clienteId;

    const fisica = await Entidade.Fisica.create({

        cpf: cpf,
        rg: rg,
        clienteId: clienteId
    });

    return res.status(201).send(fisica);
};