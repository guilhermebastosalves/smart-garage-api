const db = require('../db');

const Funcionario = db.sequelize.define('funcionario', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    data_cadastro: {
        type: db.Sequelize.DATEONLY,
        allowNull: false
    },
    nome: {
        type: db.Sequelize.STRING(50),
        allowNull: false
    },
    senha: {
        type: db.Sequelize.STRING(50),
        allowNull: false
    },
    telefone: {
        type: db.Sequelize.STRING(11),
        allowNull: false
    },
    usuario: {
        type: db.Sequelize.STRING(50),
        allowNull: false,
        unique: 'usuario_unique_idx'
    }
});

module.exports = Funcionario;