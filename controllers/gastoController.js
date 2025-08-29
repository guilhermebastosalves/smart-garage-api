const Entidade = require('../models/index');

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllGastos = async (req, res) => {
    Entidade.Gasto.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};


exports.createGasto = async (req, res) => {

    const {
        data,
        descricao,
        automovelId,
        gerenteId,
        valor
    } = req.body;

    const gasto = await Entidade.Gasto.create({

        data: data,
        descricao: descricao,
        gerenteId: gerenteId,
        automovelId: automovelId,
        valor: valor
    });

    return res.status(201).send(gasto);
};

exports.getGastoById = async (req, res) => {

    const id = req.params.id;

    try {
        const gasto = await Entidade.Gasto.findByPk(id);

        if (gasto) {
            return res.status(200).send(gasto);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Gasto não encontrado' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.updateGasto = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Gasto.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Gasto não encontrado' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};

exports.getGastoDetalhesById = async (req, res) => {
    const id = req.params.id;

    try {
        // ETAPA 1: Busca a consignação com os dados diretamente relacionados
        const gasto = await Entidade.Gasto.findByPk(id, {
            include: [
                {
                    model: Entidade.Automovel,
                    as: 'automovel',
                    include: [
                        // A inclusão da Marca a partir do Automóvel está correta
                        { model: Entidade.Marca, as: 'marca' }
                    ]
                }

            ]
        });

        if (!gasto) {
            return res.status(404).send({ erro: true, mensagemErro: 'Gasto não encontrada' });
        }

        // ETAPA 2: Busca os modelos da marca encontrada
        // Usamos o marcaId do automóvel que veio na primeira query
        const marcaIdDoAutomovel = gasto.automovel.marcaId;
        const modelosDaMarca = await Entidade.Modelo.findAll({
            where: { marcaId: marcaIdDoAutomovel }
        });

        // ETAPA 3: Junta os resultados antes de enviar
        // Convertemos o resultado do Sequelize para um objeto simples para poder modificá-lo
        const detalhesCompletos = gasto.get({ plain: true });

        // Adicionamos a lista de modelos encontrada ao objeto do automóvel
        detalhesCompletos.automovel.modelos = modelosDaMarca; // Usamos 'modelos' (plural)

        return res.status(200).send(detalhesCompletos);

    } catch (erro) {
        handleServerError(res, erro);
    }
};