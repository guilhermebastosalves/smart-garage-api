const { where } = require('sequelize');
const Entidade = require('../models/index');

exports.findByFuncionarioid = async (req, res) => {

    const { funcionarioId } = req.params.funcionarioId;

    const vendedor = await Entidade.Vendedor.findOne({
        where: {
            funcionarioId: funcionarioId
        }
    });

    if (!vendedor) {
        return res.status(404).send({ erro: true, mensagemErro: 'Vendedor não encontrado' });
    }

    return res.status(201).send(gerente);
}

// Criar um novo Vendedor (Funcionario + Vendedor)
exports.create = async (req, res) => {
    const { nome, usuario, senha } = req.body;

    if (!nome || !usuario || !senha) {
        return res.status(400).send({ mensagem: "Todos os campos são obrigatórios." });
    }

    try {
        // Criptografa a senha antes de salvar
        const senhaHash = await bcrypt.hash(senha, 10);

        // 1. Cria a entidade Funcionario
        const funcionario = await Entidade.Funcionario.create({
            nome,
            usuario,
            senha: senhaHash,
            ativo: true // Vendedores já começam ativos
        });

        // 2. Cria a entidade Vendedor associada
        await Entidade.Vendedor.create({
            funcionarioId: funcionario.id
        });

        res.status(201).send({ mensagem: "Vendedor cadastrado com sucesso!" });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({ mensagem: "Este nome de usuário já está em uso." });
        }
        res.status(500).send({ mensagem: "Erro ao cadastrar vendedor.", error });
    }
};

// Listar todos os Vendedores
exports.getAll = async (req, res) => {
    try {
        const vendedores = await Entidade.Vendedor.findAll({
            include: [{
                model: Entidade.Funcionario,
                as: 'funcionario',
                attributes: ['id', 'nome', 'usuario', 'ativo'] // Pega só os dados necessários
            }]
        });
        res.status(200).send(vendedores);
    } catch (error) {
        res.status(500).send({ mensagem: "Erro ao buscar vendedores.", error });
    }
};

// Atualizar o status (ativo/inativo)
exports.updateStatus = async (req, res) => {
    const { id } = req.params; // ID do Vendedor
    const { ativo } = req.body; // Novo status (true ou false)

    try {
        const vendedor = await Entidade.Vendedor.findByPk(id);
        if (!vendedor) {
            return res.status(404).send({ mensagem: "Vendedor não encontrado." });
        }

        await Entidade.Funcionario.update(
            { ativo: ativo },
            { where: { id: vendedor.funcionarioId } }
        );

        const mensagem = ativo ? "Vendedor reativado com sucesso." : "Vendedor inativado com sucesso.";
        res.status(200).send({ mensagem });
    } catch (error) {
        res.status(500).send({ mensagem: "Erro ao atualizar status do vendedor.", error });
    }
};