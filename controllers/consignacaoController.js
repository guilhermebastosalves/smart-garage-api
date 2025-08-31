const Entidade = require('../models/index');
const { Op, where } = require('sequelize');
const { sequelize } = require("../db");

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllConsignacoes = async (req, res) => {
    Entidade.Consignacao.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};


exports.createConsignacao = async (req, res) => {

    const {
        data_inicio,
        data_fim,
        ativo,
        valor,
        funcionarioId,
        automovelId,
        clienteId
    } = req.body;

    const consignacao = await Entidade.Consignacao.create({

        data_inicio: data_inicio,
        data_fim: data_fim,
        ativo: ativo,
        valor: valor,
        funcionarioId: funcionarioId,
        automovelId: automovelId,
        clienteId: clienteId
    });

    return res.status(201).send(consignacao);
}

exports.getAllConsignacoesOrderByData = async (req, res) => {
    Entidade.Consignacao.findAll({
        where: {
            ativo: true,
        },
        order: [
            ["data_inicio", "DESC"]
        ]
    }).then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};

exports.getConsignacaoById = async (req, res) => {

    const id = req.params.id;

    try {
        const consignacao = await Entidade.Consignacao.findByPk(id);

        if (consignacao) {
            return res.status(200).send(consignacao);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Consignação não encontrada' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.getConsignacaoByAutomovel = async (req, res) => {

    const automovelId = req.params.automovelId;

    try {

        const consignacao = await Entidade.Consignacao.findOne({
            where: {
                ativo: true,
                automovelId: automovelId
            }
        });

        if (consignacao) {
            return res.status(200).send(consignacao);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Consignação não encontrada' })
        }

    } catch (erro) {
        handleServerError(res, erro)
    }
};

exports.updateConsignacao = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    try {
        const update = await Entidade.Consignacao.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Consignação não encontrada' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};

exports.getAllConsignacoesAtivas = async (req, res) => {
    try {
        const consignacoes = await Entidade.Consignacao.findAll({
            where: {
                ativo: true
            },
        });
        res.status(200).send(consignacoes);
    } catch (err) {
        handleServerError(res, err);
    }
};

exports.getAllConsignacoesInativas = async (req, res) => {
    try {
        const consignacoes = await Entidade.Consignacao.findAll({
            where: {
                ativo: false
            },
        });
        res.status(200).send(consignacoes);
    } catch (err) {
        handleServerError(res, err);
    }
};

exports.getConsignacaoDetalhesById = async (req, res) => {
    const id = req.params.id;

    try {
        // ETAPA 1: Busca a consignação com os dados diretamente relacionados
        const consignacao = await Entidade.Consignacao.findByPk(id, {
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

        if (!consignacao) {
            return res.status(404).send({ erro: true, mensagemErro: 'Consignação não encontrada' });
        }

        // ETAPA 2: Busca os modelos da marca encontrada
        // Usamos o marcaId do automóvel que veio na primeira query
        const marcaIdDoAutomovel = consignacao.automovel.marcaId;
        const modelosDaMarca = await Entidade.Modelo.findAll({
            where: { marcaId: marcaIdDoAutomovel }
        });

        // ETAPA 3: Junta os resultados antes de enviar
        // Convertemos o resultado do Sequelize para um objeto simples para poder modificá-lo
        const detalhesCompletos = consignacao.get({ plain: true });

        // Adicionamos a lista de modelos encontrada ao objeto do automóvel
        detalhesCompletos.automovel.modelos = modelosDaMarca; // Usamos 'modelos' (plural)

        return res.status(200).send(detalhesCompletos);

    } catch (erro) {
        handleServerError(res, erro);
    }
};


// Arquivo: src/controllers/consignacaoController.js

// ... (outras funções do controller)

exports.encerrarConsignacao = async (req, res) => {
    const id = req.params.id;
    const { data_termino } = req.body; // Recebe a data de término do front-end

    // Validação simples para garantir que a data foi enviada
    if (!data_termino) {
        return res.status(400).send({ erro: true, mensagemErro: "A data de término é obrigatória." });
    }

    // 1. Converte a string recebida para um objeto Date.
    const dataTerminoObj = new Date(data_termino);

    // 2. Cria um objeto Date para o dia de hoje.
    const hoje = new Date();

    // 3. Zera as horas de ambas as datas para comparar apenas o dia, 
    //    ignorando o horário e o fuso.
    dataTerminoObj.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    // 4. Compara os objetos Date. Agora a comparação é cronológica.
    if (dataTerminoObj > hoje) {
        return res.status(400).send({ erro: true, mensagemErro: "A data de término não pode ser uma data futura." });
    }

    const t = await sequelize.transaction();

    try {

        // 2. Encontrar a consignação para obter o ID do automóvel
        const consignacao = await Entidade.Consignacao.findByPk(id, { transaction: t });

        if (!consignacao) {
            await t.rollback(); // Desfaz a transação se a consignação não for encontrada
            return res.status(404).send({ erro: true, mensagemErro: 'Consignação não encontrada.' });
        }

        const automovelIdParaInativar = consignacao?.automovelId;

        // 3. Atualizar a consignação para inativa
        await Entidade.Consignacao.update(
            {
                ativo: false,
                data_fim: data_termino
            },
            {
                where: { id: id },
                transaction: t // Garante que esta operação faça parte da transação
            }
        );

        // 4. ATUALIZAR O AUTOMÓVEL para inativo
        if (automovelIdParaInativar) {
            await Entidade.Automovel.update(
                { ativo: false },
                {
                    where: { id: automovelIdParaInativar },
                    transaction: t // Garante que esta operação também faça parte da transação
                }
            );
        }

        // 5. Se tudo deu certo, confirma as operações no banco
        await t.commit();

        // Retorna uma mensagem de sucesso
        return res.status(200).send({ sucesso: true, mensagem: 'Consignação encerrada com sucesso!' });

    } catch (erro) {
        await t.rollback();
        handleServerError(res, erro);
    }
};

exports.deleteConsignacao = async (req, res) => {
    const id = req.params.id;

    // Inicia uma transação
    const t = await sequelize.transaction();

    try {
        // 1. Encontrar a consignação para obter o ID do automóvel
        const consignacao = await Entidade.Consignacao.findByPk(id, { transaction: t });

        if (!consignacao) {
            await t.rollback(); // Desfaz a transação
            return res.status(404).send({ erro: true, mensagemErro: "Consignação não encontrada." });
        }

        const automovelIdParaDeletar = consignacao.automovelId;

        // 2. Deletar o registro da consignação
        await Entidade.Consignacao.destroy({
            where: { id: id },
            transaction: t
        });

        // 3. Deletar o registro do automóvel associado
        if (automovelIdParaDeletar) {

            const auto = await Entidade.Automovel.findByPk(automovelIdParaDeletar);


            await Entidade.Automovel.destroy({
                where: { id: automovelIdParaDeletar },
                transaction: t
            });

            await Entidade.Modelo.destroy({
                where: { marcaId: auto?.dataValues?.marcaId },
                transaction: t
            })

            await Entidade.Marca.destroy({
                where: { id: auto?.dataValues?.marcaId },
                transaction: t
            })

        }

        // 4. Se tudo deu certo, confirma as operações no banco
        await t.commit();

        return res.status(200).send({ sucesso: true, mensagem: "Consignação e automóvel associado foram excluídos com sucesso." });

    } catch (erro) {
        // 5. Se algo deu errado, desfaz todas as operações
        await t.rollback();
        handleServerError(res, erro);
    }
};