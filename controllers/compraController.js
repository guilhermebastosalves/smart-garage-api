const Entidade = require('../models/index');

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllCompras = async (req, res) => {
    Entidade.Compra.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};


exports.createCompra = async (req, res) => {

    var data = req.body.data;
    var valor = req.body.valor;
    var gerenteId = req.body.gerenteId;
    var automovelId = req.body.automovelId;
    var clienteId = req.body.clienteId;

    const compra = await Entidade.Compra.create({

        data: data,
        valor: valor,
        gerenteId: gerenteId,
        automovelId: automovelId,
        clienteId: clienteId
    });

    return res.status(201).send(compra);
};

exports.getCompraById = async (req, res) => {

    const id = req.params.id;

    try {
        const compra = await Entidade.Compra.findByPk(id);

        if (compra) {
            return res.status(200).send(compra);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Consignação não encontrada' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.updateCompra = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Compra.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Compra não encontrada' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};