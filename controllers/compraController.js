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

exports.getCompraDetalhesById = async (req, res) => {
    const id = req.params.id;

    try {
        // ETAPA 1: Busca a consignação com os dados diretamente relacionados
        const compra = await Entidade.Compra.findByPk(id, {
            include: [
                {
                    model: Entidade.Automovel,
                    as: 'automovel',
                    include: [
                        // A inclusão da Marca a partir do Automóvel está correta
                        { model: Entidade.Marca, as: 'marca' }
                    ]
                },
                {
                    model: Entidade.Cliente,
                    as: 'cliente',
                    include: [
                        { model: Entidade.Fisica, as: 'fisica' },
                        { model: Entidade.Juridica, as: 'juridica' }
                    ]
                }

            ]
        });

        if (!compra) {
            return res.status(404).send({ erro: true, mensagemErro: 'Compra não encontrada' });
        }

        // ETAPA 2: Busca os modelos da marca encontrada
        // Usamos o marcaId do automóvel que veio na primeira query
        const marcaIdDoAutomovel = compra.automovel.marcaId;
        const modelosDaMarca = await Entidade.Modelo.findAll({
            where: { marcaId: marcaIdDoAutomovel }
        });

        // ETAPA 3: Junta os resultados antes de enviar
        // Convertemos o resultado do Sequelize para um objeto simples para poder modificá-lo
        const detalhesCompletos = compra.get({ plain: true });

        // Adicionamos a lista de modelos encontrada ao objeto do automóvel
        detalhesCompletos.automovel.modelos = modelosDaMarca; // Usamos 'modelos' (plural)

        return res.status(200).send(detalhesCompletos);

    } catch (erro) {
        handleServerError(res, erro);
    }
};