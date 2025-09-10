const db = require('../db');

const Vendedor = db.sequelize.define('vendedor', {
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
    }
});


module.exports = Vendedor;