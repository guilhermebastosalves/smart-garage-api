// src/controllers/loginController.js
const { Op } = require("sequelize");
const { Sequelize } = require("../db");
const Entidade = require("../models/index");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.login = async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).send({ mensagem: "Usuário e senha são obrigatórios." });
    }

    try {
        // 1. Encontrar o funcionário pelo nome de usuário
        const funcionario = await Entidade.Funcionario.findOne({ where: { usuario } });
        if (!funcionario) {
            return res.status(404).send({ mensagem: "Usuário ou senha inválida." });
        }

        // NOVO: VERIFICA SE O FUNCIONÁRIO ESTÁ ATIVO
        if (!funcionario.ativo) {
            // Retorna o erro 403 Forbidden (Proibido), pois o usuário existe mas não tem permissão para logar.
            return res.status(403).send({ mensagem: "Este usuário está inativo." });
        }

        // 2. Comparar a senha enviada com a senha hasheada no banco
        const senhaValida = await bcrypt.compare(senha, funcionario?.senha);

        if (!senhaValida) {
            return res.status(401).send({ mensagem: "Usuário ou senha inválida." });
        }

        // 3. Descobrir o papel (role) do funcionário
        let role = null;

        const gerente = await Entidade.Gerente.findOne({
            where: { funcionarioId: funcionario.id }
        });

        if (gerente) {
            role = 'gerente';
        } else {
            // 2. Verifica se é vendedor usando a chave estrangeira correta
            const vendedor = await Entidade.Vendedor.findOne({
                where: { funcionarioId: funcionario.id }
            });

            if (vendedor) {
                role = 'vendedor';
            }
        }

        if (!role) {
            return res.status(403).send({ mensagem: "Funcionário sem cargo definido." });
        }

        // 4. Gerar o Token JWT
        const token = jwt.sign(
            {
                id: funcionario?.id,
                nome: funcionario?.nome,
                role: role // Incluímos o papel no token!
            },
            process.env.JWT_SECRET || 'seu_segredo_super_secreto', // Use uma variável de ambiente!
            { expiresIn: '8h' } // Token expira em 8 horas
        );

        // 5. Enviar o token para o cliente
        res.status(200).send({
            mensagem: "Login bem-sucedido!",
            token: token
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).send({ erro: 'Um erro ocorreu no servidor.' });
    }
};

exports.solicitarResetSenha = async (req, res) => {
    const { usuario } = req.body;

    try {
        const funcionario = await Entidade.Funcionario.findOne({ where: { usuario } });

        if (!funcionario) {
            // Enviamos uma mensagem de sucesso mesmo que o usuário não exista
            // para não revelar quais usuários estão cadastrados no sistema.
            return res.status(200).send({ mensagem: "Se um usuário com este nome existir, um e-mail de redefinição foi enviado." });
        }

        // Gera um token aleatório e seguro
        const token = crypto.randomBytes(20).toString('hex');

        // Define a data de expiração para 1 hora a partir de agora
        const expires = new Date(Date.now() + 3600000); // 1 hora

        // Salva o token e a data de expiração no registro do funcionário
        funcionario.resetPasswordToken = token;
        funcionario.resetPasswordExpires = expires;
        await funcionario.save();

        // Envia o e-mail
        await emailService.enviarEmailResetSenha(funcionario.email, token);

        res.status(200).send({ mensagem: "Se um usuário com este nome existir, um e-mail de redefinição foi enviado." });

    } catch (error) {
        handleServerError(res, error);
    }
};

exports.resetarSenha = async (req, res) => {
    const { token } = req.params;
    const { senha } = req.body;

    try {
        const funcionario = await Entidade.Funcionario.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Sequelize.Op.gt]: Date.now() } // Verifica se o token não expirou
            }
        });

        if (!funcionario) {
            return res.status(400).send({ mensagem: "Token de redefinição inválido ou expirado." });
        }

        // Token válido, agora atualizamos a senha
        const senhaHash = await bcrypt.hash(senha, 10);
        funcionario.senha = senhaHash;
        funcionario.resetPasswordToken = null; // Invalida o token
        funcionario.resetPasswordExpires = null;
        await funcionario.save();

        res.status(200).send({ mensagem: "Senha redefinida com sucesso!" });

    } catch (error) {
        handleServerError(res, error);
    }
};