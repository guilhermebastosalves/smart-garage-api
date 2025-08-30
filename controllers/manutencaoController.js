const Entidade = require('../models/index');
const { sequelize } = require('../db');


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

exports.getManutencaoDetalhesById = async (req, res) => {
    const id = req.params.id;

    try {
        // ETAPA 1: Busca a consignação com os dados diretamente relacionados
        const manutencao = await Entidade.Manutencao.findByPk(id, {
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

        if (!manutencao) {
            return res.status(404).send({ erro: true, mensagemErro: 'Manutencao não encontrada' });
        }

        // ETAPA 2: Busca os modelos da marca encontrada
        // Usamos o marcaId do automóvel que veio na primeira query
        const marcaIdDoAutomovel = manutencao.automovel.marcaId;
        const modelosDaMarca = await Entidade.Modelo.findAll({
            where: { marcaId: marcaIdDoAutomovel }
        });

        // ETAPA 3: Junta os resultados antes de enviar
        // Convertemos o resultado do Sequelize para um objeto simples para poder modificá-lo
        const detalhesCompletos = manutencao.get({ plain: true });

        // Adicionamos a lista de modelos encontrada ao objeto do automóvel
        detalhesCompletos.automovel.modelos = modelosDaMarca; // Usamos 'modelos' (plural)

        return res.status(200).send(detalhesCompletos);

    } catch (erro) {
        handleServerError(res, erro);
    }
};

exports.deleteManutencao = async (req, res) => {
    const id = req.params.id;

    // Inicia uma transação
    const t = await sequelize.transaction();

    try {
        // 1. Encontrar a manutencao para obter o ID do automóvel
        const manutencao = await Entidade.Manutencao.findByPk(id, { transaction: t });

        if (!manutencao) {
            await t.rollback(); // Desfaz a transação
            return res.status(404).send({ erro: true, mensagemErro: "Manutenção não encontrada." });
        }

        // 2. Deletar o registro de manutencao
        await Entidade.Manutencao.destroy({
            where: { id: id },
            transaction: t
        });

        // 3. Se tudo deu certo, confirma as operações
        await t.commit();

        return res.status(200).send({ sucesso: true, mensagem: "Manutenção excluída com sucesso." });

    } catch (erro) {
        // 4. Se algo deu errado, desfaz tudo
        await t.rollback();
        handleServerError(res, erro); // função de erro genérica
    }
};

exports.getAllManutencoesOrderByData = async (req, res) => {
    Entidade.Manutencao.findAll({
        where: {
            ativo: true,
        },
        order: [
            ["data_envio", "DESC"]
        ]
    }).then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};