const bcrypt = require('bcryptjs');
const Entidade = require('../models/index');
const { sequelize } = require("../db");

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.createFuncionario = async (req, res) => {
    const { nome, telefone, usuario, senha, role, email } = req.body;

    if (!['gerente', 'vendedor'].includes(role)) {
        return res.status(400).send({ erro: true, mensagemErro: "O cargo deve ser 'gerente' ou 'vendedor'." });
    }

    const t = await sequelize.transaction();

    try {
        // Gera um "sal" e cria o hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const novoFuncionario = await Entidade.Funcionario.create({
            nome,
            telefone,
            usuario,
            senha: senhaHash, // Salva a senha hasheada
            data_cadastro: new Date(),
            email
        }, { transaction: t });

        // IMPORTANTE: Após criar o funcionário, você precisa associá-lo
        // a Gerente ou Vendedor, salvando o novo ID na tabela correspondente.

        if (role === 'gerente') {
            await Entidade.Gerente.create({ funcionarioId: novoFuncionario?.dataValues.id }, { transaction: t });
        } else {
            await Entidade.Vendedor.create({ funcionarioId: novoFuncionario?.dataValues.id }, { transaction: t });
        }

        await t.commit();

        const { senha: _, ...funcionarioSemSenha } = novoFuncionario.get({ plain: true });

        res.status(201).send(funcionarioSemSenha);
    } catch (error) {
        await t.rollback();
        handleServerError(res, error);
    }
};

exports.getAllFuncionarios = async (req, res) => {
    Entidade.Funcionario.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};