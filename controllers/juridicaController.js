const Entidade = require('../models/index');
const { Op } = require("sequelize");


// Função auxiliar para lidar com erros
const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).send({ erro: 'Um erro ocorreu' });
};

exports.getAllJuridica = async (req, res) => {
    Entidade.Juridica.findAll().then((values) => {
        res.status(200).send(values);
    }).catch((err) => {
        handleServerError(res, err);
    })
};

exports.getJuridicaById = async (req, res) => {

    const id = req.params.id;

    try {
        const juridica = await Entidade.Juridica.findByPk(id);

        if (juridica) {
            return res.status(200).send(juridica);
        }
        else {
            return res.status(404).send({ erro: true, mensagemErro: 'Cliente não encontrado' });;
        }
    } catch (erro) {
        handleServerError(res, erro);
    }

};

exports.getJuridicaByCnpj = async (req, res) => {

    const identificacao = req.params.identificacao;

    try {
        const juridica = await Entidade.Juridica.findAll({
            where: {
                cnpj: identificacao
            },
        });

        if (juridica) {
            res.status(200).send(juridica);
        } else {
            return res.status(404).send({ erro: true, mensagemErro: 'Pessoa jurídica não encontrada' });;
        }
    } catch (err) {
        handleServerError(res, err);
    }
};

exports.createJuridica = async (req, res) => {

    const {
        cnpj,
        nome_responsavel,
        razao_social,
        clienteId
    } = req.body;

    const razaoSocialParaSalvar = razao_social ? razao_social : null;

    try {

        const juridica = await Entidade.Juridica.create({
            cnpj: cnpj,
            nome_responsavel: nome_responsavel,
            razao_social: razaoSocialParaSalvar,
            clienteId: clienteId
        });

        return res.status(201).send(juridica);

    } catch (erro) {
        handleServerError(res, erro)
    }
};

// exports.verificarDuplicidade = async (req, res) => {

//     const { cnpj, razao_social } = req.body;

//     const condicoes = [];

//     const cnpjExistente = await Entidade.Juridica.findOne({
//         where: {
//             [Op.or]: [{ cnpj }]
//         }
//     });

//     if (razao_social) {
//         condicoes.push({ razao_social: razao_social });
//     }

//     const razaoExistente = await Entidade.Juridica.findOne({
//         where: {
//             [Op.or]: [{ razao_social }]
//         }
//     });

//     if (cnpjExistente) {
//         return res.status(409).send({ erro: true, mensagemErro: 'Já existe um cliente com esse cnpj.' });
//     }

//     if (razaoExistente) {
//         return res.status(409).send({ erro: true, mensagemErro: 'Já existe um cliente com essa razão social.' });

//     }

//     return res.status(200).send({ erro: false });
// };


exports.verificarDuplicidade = async (req, res) => {
    const { cnpj, razao_social } = req.body;

    try {
        // 1. Cria um array para as condições de busca
        const condicoes = [];

        // 2. Adiciona a condição do CNPJ somente se ele foi enviado
        if (cnpj) {
            condicoes.push({ cnpj: cnpj });
        }

        // 3. Adiciona a condição da Razão Social somente se ela foi enviada (e não é vazia)
        if (razao_social) {
            condicoes.push({ razao_social: razao_social });
        }

        // Se nenhuma condição foi formada (nenhum dado enviado), não há o que verificar
        if (condicoes.length === 0) {
            return res.status(200).send({ erro: false });
        }

        // 4. Executa a busca apenas com as condições válidas
        const existente = await Entidade.Juridica.findOne({
            where: {
                [Op.or]: condicoes // Usa o array de condições dinâmico
            }
        });

        if (existente) {
            // Descobre qual campo causou a duplicidade para dar uma mensagem clara
            const campo = existente.cnpj === cnpj ? 'CNPJ' : 'Razão Social';
            // console.log(campo)
            return res.status(409).send({ erro: true, mensagemErro: `Campo ${campo} duplicado, já existe um cliente com esse registro.` });
        }

        return res.status(200).send({ erro: false });

    } catch (error) {
        handleServerError(res, error);
    }
};