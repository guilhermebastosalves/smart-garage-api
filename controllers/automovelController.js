const { where } = require("sequelize");
const Entidade = require("../models/index");
const { Op } = require("sequelize");
const { response } = require("express");

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};


exports.getAllAutomoveis = async (req, res) => {
    Entidade.Automovel.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
}

exports.createAutomovel = async (req, res) => {

    const {
        ano_fabricacao,
        ano_modelo,
        cor,
        combustivel,
        km,
        origem,
        placa,
        renavam,
        valor,
        marcaId,
        modeloId
    } = req.body;

    const file = req.file;
    const imagemPath = file ? file.path : null;
    const placaUpperCase = placa ? placa.toUpperCase() : null;


    try {
        const automovel = await Entidade.Automovel.create({

            ano_fabricacao: ano_fabricacao,
            ano_modelo: ano_modelo,
            ativo: true,
            cor: cor,
            combustivel: combustivel,
            km: km,
            origem: origem,
            placa: placaUpperCase,
            renavam: renavam,
            valor: valor,
            marcaId: marcaId,
            imagem: imagemPath,
            modeloId: modeloId
        });

        return res.status(201).send(automovel);
    } catch (error) {
        console.error("Erro ao criar automóvel:", error);
        return res.status(500).send({ erro: true, mensagemErro: "Erro ao cadastrar automóvel" });
    }


}

exports.verificarDuplicidade = async (req, res) => {
    // 1. Recebe o ID do automóvel que está sendo editado (se houver)
    const { placa, renavam, idAutomovelAtual } = req.body;

    try {
        const condicoes = [];

        // Adiciona as condições de busca somente se os campos foram enviados
        if (placa) condicoes.push({ placa: placa });
        if (renavam) condicoes.push({ renavam: renavam });

        // Se nenhum dado foi enviado, não há o que verificar
        if (condicoes.length === 0) {
            return res.status(200).send({ erro: false });
        }

        // 2. Monta a cláusula 'where' principal para buscar por placa OU renavam
        const whereClause = {
            [Op.or]: condicoes
        };

        // 3. Se um ID de automóvel atual foi fornecido (modo de edição),
        //    adiciona uma condição para EXCLUIR esse automóvel da busca.
        if (idAutomovelAtual) {
            whereClause.id = { [Op.ne]: idAutomovelAtual }; // Op.ne = Not Equal (Não é igual a)
        }

        // 4. Executa uma única consulta ao banco de dados
        const existente = await Entidade.Automovel.findOne({
            where: whereClause
        });

        if (existente) {
            if (placa && existente.placa && existente.placa.trim().toUpperCase() === placa.trim().toUpperCase()) {
                return res.status(409).send({ erro: true, mensagemErro: 'Já existe outro automóvel com este registro de Placa.' });
            }
            if (renavam && existente.renavam === renavam) {
                return res.status(409).send({ erro: true, mensagemErro: 'Já existe outro automóvel com este registro de Renavam.' });
            }
            // Caso raro: ambos diferentes, mas caiu aqui (não deveria acontecer)
            return res.status(409).send({ erro: true, mensagemErro: 'Já existe outro automóvel com este registro.' });
        }

        // Se não encontrou nenhum outro automóvel, a verificação passa
        return res.status(200).send({ erro: false });

    } catch (error) {
        handleServerError(res, error);
    }
};

exports.getAutomovelById = async (req, res) => {

    const id = req.params.id;

    try {
        const automovel = await Entidade.Automovel.findByPk(id);

        if (automovel) {
            return res.status(200).send(automovel);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel não encontrado' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.getAutomovelByRenavam = async (req, res) => {

    const renavam = req.params.renavam;

    try {

        // if (!renavam || typeof renavam !== "string" || renavam.trim() === "" || renavam === "" || renavam === undefined) {
        //     return res.status(400).send({ erro: true, mensagemErro: "Informe o renavam" });
        // }

        const automovel = await Entidade.Automovel.findOne({
            where: {
                renavam: renavam
            }
        });

        if (automovel) {
            return res.status(200).send(automovel);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel não encontrado' });
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.getAutomovelByPlaca = async (req, res) => {

    const placa = req.params.placa;

    try {

        // if (!renavam || typeof renavam !== "string" || renavam.trim() === "" || renavam === "" || renavam === undefined) {
        //     return res.status(400).send({ erro: true, mensagemErro: "Informe o renavam" });
        // }

        const automovel = await Entidade.Automovel.findOne({
            where: {
                placa: placa
            }
        });

        if (automovel) {
            return res.status(200).send(automovel);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel não encontrado' });
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.updateAutomovel = async (req, res) => {

    const id = req.params.id;

    const updateData = req.body;

    if (req.file) {
        // Se um novo arquivo existe, adiciona seu caminho aos dados de atualização
        const file = req.file;
        // const imagemPath = file ? file.path : null;

        // updateData.imagem = req.file.path;

        updateData.imagem = file ? file.path : null;
        console.log(`Nova imagem recebida para o automóvel ${id}: ${req.file.path}`);
    }

    try {
        const update = await Entidade.Automovel.update(updateData, {
            where: { id: id }
        });

        if (!update) {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel não encontrado' });
        }

        return res.status(200).send(update);

    } catch (erro) {
        handleServerError(res, erro);
    }
};

exports.getAllAutomoveisAtivos = async (req, res) => {
    try {
        const automovel = await Entidade.Automovel.findAll({
            where: {
                ativo: true
            },
        });
        res.status(200).send(automovel);
    } catch (err) {
        handleServerError(res, err);
    }
};

exports.getAllAutomoveisInativos = async (req, res) => {
    try {
        const automovel = await Entidade.Automovel.findAll({
            where: {
                ativo: false
            },
        });
        res.status(200).send(automovel);
    } catch (err) {
        handleServerError(res, err);
    }
};

exports.getAutomovelDetalhesById = async (req, res) => {
    const id = req.params.id;

    try {
        // ETAPA 1: Busca a consignação com os dados diretamente relacionados
        const automovel = await Entidade.Automovel.findByPk(id, {
            include: [
                {
                    model: Entidade.Marca,
                    as: 'marca'
                },
                {
                    model: Entidade.Modelo,
                    as: 'modelo'
                }

            ]
        });

        if (!automovel) {
            return res.status(404).send({ erro: true, mensagemErro: 'Automóvel não encontrado' });
        }

        // ETAPA 2: Busca os modelos da marca encontrada
        // Usamos o marcaId do automóvel que veio na primeira query
        // const marcaIdDoAutomovel = automovel.marcaId;
        // const modelosDaMarca = await Entidade.Modelo.findAll({
        //     where: { id: automovel?.modeloId }
        // });

        // ETAPA 3: Junta os resultados antes de enviar
        // Convertemos o resultado do Sequelize para um objeto simples para poder modificá-lo
        // const detalhesCompletos = automovel.get({ plain: true });

        // Adicionamos a lista de modelos encontrada ao objeto do automóvel
        // detalhesCompletos.modelos = modelosDaMarca; // Usamos 'modelos' (plural)

        return res.status(200).send(automovel);

    } catch (erro) {
        handleServerError(res, erro);
    }
};