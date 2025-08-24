const Entidade = require('../models/index');

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllManutencoes = async (req, res) => {
    Entidade.Manutencao.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};


exports.createManutencao = async (req, res) => {

    const {
        ativo,
        data_envio,
        data_retorno,
        previsao_retorno,
        descricao,
        automovelId,
        gerenteId,
        valor
    } = req.body;

    const manutencao = await Entidade.Manutencao.create({

        ativo: ativo,
        data_envio: data_envio,
        data_retorno: data_retorno,
        previsao_retorno: previsao_retorno,
        descricao: descricao,
        gerenteId: gerenteId,
        automovelId: automovelId,
        valor: valor
    });

    return res.status(201).send(manutencao);
};

exports.getManutencaoById = async (req, res) => {

    const id = req.params.id;

    try {
        const manutencao = await Entidade.Manutencao.findByPk(id);

        if (manutencao) {
            return res.status(200).send(manutencao);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Manutenção não encontrada' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.updateManutencao = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Manutencao.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Manutenção não encontrado' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};