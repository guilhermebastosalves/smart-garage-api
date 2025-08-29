const Entidade = require('../models/index');

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllTrocas = async (req, res) => {
    Entidade.Troca.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};


exports.createTroca = async (req, res) => {

    const {
        comissao,
        data,
        forma_pagamento,
        valor,
        clienteId,
        funcionarioId,
        automovelId,
        automovel_fornecido
    } = req.body;

    const troca = await Entidade.Troca.create({

        comissao: comissao,
        data: data,
        forma_pagamento: forma_pagamento,
        valor: valor,
        clienteId: clienteId,
        funcionarioId: funcionarioId,
        automovelId: automovelId,
        automovel_fornecido: automovel_fornecido
    });

    return res.status(201).send(troca);
};

exports.getTrocaById = async (req, res) => {

    const id = req.params.id;

    try {
        const troca = await Entidade.Troca.findByPk(id);

        if (troca) {
            return res.status(200).send(troca);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel Fornecido não encontrado' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.updateTroca = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Troca.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Troca não encontrada' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};

exports.getTrocaDetalhesById = async (req, res) => {
    const id = req.params.id;

    try {
        // ETAPA 1: Busca a consignação com os dados diretamente relacionados
        const troca = await Entidade.Troca.findByPk(id, {
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

        if (!troca) {
            return res.status(404).send({ erro: true, mensagemErro: 'Troca não encontrada' });
        }

        // ETAPA 2: Busca os modelos da marca encontrada
        // Usamos o marcaId do automóvel que veio na primeira query
        const marcaIdDoAutomovel = troca.automovel.marcaId;
        const modelosDaMarca = await Entidade.Modelo.findAll({
            where: { marcaId: marcaIdDoAutomovel }
        });

        // ETAPA 3: Junta os resultados antes de enviar
        // Convertemos o resultado do Sequelize para um objeto simples para poder modificá-lo
        const detalhesCompletos = troca.get({ plain: true });

        // Adicionamos a lista de modelos encontrada ao objeto do automóvel
        detalhesCompletos.automovel.modelos = modelosDaMarca; // Usamos 'modelos' (plural)

        return res.status(200).send(detalhesCompletos);

    } catch (erro) {
        handleServerError(res, erro);
    }
};