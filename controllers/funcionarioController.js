const bcrypt = require('bcryptjs');
const Entidade = require('../models/index');

// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.createFuncionario = async (req, res) => {
    const { nome, telefone, usuario, senha } = req.body;

    try {
        // Gera um "sal" e cria o hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const novoFuncionario = await Entidade.Funcionario.create({
            nome,
            telefone,
            usuario,
            senha: senhaHash, // Salva a senha hasheada
            data_cadastro: new Date()
        });

        // IMPORTANTE: Após criar o funcionário, você precisa associá-lo
        // a Gerente ou Vendedor, salvando o novo ID na tabela correspondente.
        const { role } = req.body; //(onde role é 'gerente' ou 'vendedor')
        if (role === 'gerente') {
            await Entidade.Gerente.create({ id: novoFuncionario?.dataValues.id });
        } else {
            await Entidade.Vendedor.create({ id: novoFuncionario?.dataValues.id });
        }

        res.status(201).send(novoFuncionario);
    } catch (error) {
        handleServerError(res, error);
    }
};