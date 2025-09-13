'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('marca', [
      { nome: 'Audi', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'BMW', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Caoa Chery', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Chevrolet', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Citroën', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Fiat', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Ford', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Honda', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Hyundai', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Jeep', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Kia', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Land Rover', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Mercedes-Benz', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Mitsubishi', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Nissan', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Peugeot', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Renault', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Toyota', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Volkswagen', createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Volvo', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('marca', null, {});
  }
};