// src/controllers/loginController.js

const Entidade = require("../models/index");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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