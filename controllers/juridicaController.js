const Entidade = require('../models/index');

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


exports.createJuridica = async (req, res) => {

    var cnpj = req.body.cnpj;
    var nome_responsavel = req.body.nome_responsavel;
    var razao_social = req.body.razao_social;
    var clienteId = req.body.clienteId;

    const juridica = await Entidade.Juridica.create({

        cnpj: cnpj,
        nome_responsavel: nome_responsavel,
        razao_social: razao_social,
        clienteId: clienteId
    });

    return res.status(201).send(juridica);
};