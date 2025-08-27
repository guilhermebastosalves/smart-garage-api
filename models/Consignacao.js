const db = require('../db');

const Consignacao = db.sequelize.define('consignacao', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    ativo: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    data_fim: {
        type: db.Sequelize.DATEONLY,
        default: null
    },
    data_inicio: {
        type: db.Sequelize.DATEONLY,
        allowNull: false
    },
    valor: {
        type: db.Sequelize.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = Consignacao;