const Entidade = require("../models/index");
const { sequelize } = require("../db");


// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllVendas = async (req, res) => {
    try {
        Entidade.Venda.findAll().then((values) => {
            res.status(200).send(values)
        })
    } catch (err) {
        handleServerError(res, err)
    }
};

exports.createVenda = async (req, res) => {
    try {

        const {
            data,
            forma_pagamento,
            valor,
            comissao,
            automovelId,
            clienteId,
            funcionarioId
        } = req.body;

        const venda = await Entidade.Venda.create({

            data: data,
            forma_pagamento: forma_pagamento,
            comissao: comissao,
            valor: valor,
            funcionarioId: funcionarioId,
            automovelId: automovelId,
            clienteId: clienteId
        });

        return res.status(201).send(venda);

    } catch (err) {
        handleServerError(res, err)
    }
};

exports.getAllVendasOrderByData = async (req, res) => {
    Entidade.Venda.findAll({
        order: [
            ["data", "DESC"]
        ]
    }).then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};

exports.getVendaById = async (req, res) => {

    const id = req.params.id;

    try {
        const venda = await Entidade.Venda.findByPk(id);

        if (venda) {
            return res.status(200).send(venda);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Venda não encontrada' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};


exports.updateVenda = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Venda.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Venda não encontrada' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};

exports.getVendaDetalhesById = async (req, res) => {
    const id = req.params.id;

    try {
        // ETAPA 1: Busca a consignação com os dados diretamente relacionados
        const venda = await Entidade.Venda.findByPk(id, {
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

        if (!venda) {
            return res.status(404).send({ erro: true, mensagemErro: 'venda não encontrada' });
        }

        // ETAPA 2: Busca os modelos da marca encontrada
        // Usamos o marcaId do automóvel que veio na primeira query
        const marcaIdDoAutomovel = venda.automovel.marcaId;
        const modelosDaMarca = await Entidade.Modelo.findAll({
            where: { marcaId: marcaIdDoAutomovel }
        });

        // ETAPA 3: Junta os resultados antes de enviar
        // Convertemos o resultado do Sequelize para um objeto simples para poder modificá-lo
        const detalhesCompletos = venda.get({ plain: true });

        // Adicionamos a lista de modelos encontrada ao objeto do automóvel
        detalhesCompletos.automovel.modelos = modelosDaMarca; // Usamos 'modelos' (plural)

        return res.status(200).send(detalhesCompletos);

    } catch (erro) {
        handleServerError(res, erro);
    }
};

exports.deleteVenda = async (req, res) => {
    const id = req.params.id;

    // Inicia uma transação
    const t = await sequelize.transaction();

    try {
        // 1. Encontrar a venda para obter o ID do automóvel
        const venda = await Entidade.Venda.findByPk(id, { transaction: t });

        if (!venda) {
            await t.rollback(); // Desfaz a transação
            return res.status(404).send({ erro: true, mensagemErro: "Venda não encontrada." });
        }

        const automovelIdParaReativar = venda.automovelId;

        // 2. Deletar o registro da venda
        await Entidade.Venda.destroy({
            where: { id: id },
            transaction: t
        });

        // 3. ATUALIZAR o automóvel associado, definindo-o como ATIVO
        if (automovelIdParaReativar) {
            await Entidade.Automovel.update(
                { ativo: true }, // A mudança principal está aqui!
                {
                    where: { id: automovelIdParaReativar },
                    transaction: t
                }
            );
        }

        // 4. Se tudo deu certo, confirma as operações
        await t.commit();

        return res.status(200).send({ sucesso: true, mensagem: "Venda excluída e automóvel retornado ao estoque." });

    } catch (erro) {
        // 5. Se algo deu errado, desfaz tudo
        await t.rollback();
        handleServerError(res, erro); // Sua função de erro genérica
    }
};