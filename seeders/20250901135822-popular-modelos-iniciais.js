'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Primeiro, buscamos as marcas existentes para pegar seus IDs
    const marcas = await queryInterface.sequelize.query(
      `SELECT id, nome FROM marca;`, { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // 2. Criamos um mapa para facilitar a busca do ID pelo nome da marca
    const marcaMap = {};
    marcas.forEach(marca => {
      marcaMap[marca.nome] = marca.id;
    });

    // 3. Definimos os modelos para cada marca
    const modelos = [
      // Chevrolet
      { nome: 'Onix', marcaId: marcaMap['Chevrolet'] },
      { nome: 'Onix Plus', marcaId: marcaMap['Chevrolet'] },
      { nome: 'Tracker', marcaId: marcaMap['Chevrolet'] },
      { nome: 'S10', marcaId: marcaMap['Chevrolet'] },
      // Volkswagen
      { nome: 'Polo', marcaId: marcaMap['Volkswagen'] },
      { nome: 'T-Cross', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Nivus', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Saveiro', marcaId: marcaMap['Volkswagen'] },
      // Fiat
      { nome: 'Strada', marcaId: marcaMap['Fiat'] },
      { nome: 'Mobi', marcaId: marcaMap['Fiat'] },
      { nome: 'Argo', marcaId: marcaMap['Fiat'] },
      { nome: 'Toro', marcaId: marcaMap['Fiat'] },
      // Hyundai
      { nome: 'HB20', marcaId: marcaMap['Hyundai'] },
      { nome: 'Creta', marcaId: marcaMap['Hyundai'] },
      // Ford
      { nome: 'Ranger', marcaId: marcaMap['Ford'] },
      { nome: 'Territory', marcaId: marcaMap['Ford'] },
      // Toyota
      { nome: 'Corolla', marcaId: marcaMap['Toyota'] },
      { nome: 'Corolla Cross', marcaId: marcaMap['Toyota'] },
      { nome: 'Hilux', marcaId: marcaMap['Toyota'] },
      // Honda
      { nome: 'HR-V', marcaId: marcaMap['Honda'] },
      { nome: 'City', marcaId: marcaMap['Honda'] },
      // Jeep
      { nome: 'Compass', marcaId: marcaMap['Jeep'] },
      { nome: 'Renegade', marcaId: marcaMap['Jeep'] },
    ];

    // Adiciona createdAt e updatedAt a cada modelo
    const modelosComTimestamp = modelos.map(m => ({
      ...m,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('modelo', modelosComTimestamp, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('modelo', null, {});
  }
};
