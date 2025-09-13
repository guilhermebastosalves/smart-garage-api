'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const marcas = await queryInterface.sequelize.query(
      `SELECT id, nome FROM marca;`, { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const marcaMap = {};
    marcas.forEach(marca => {
      marcaMap[marca.nome] = marca.id;
    });

    const modelos = [
      // Audi
      { nome: 'A3', marcaId: marcaMap['Audi'] },
      { nome: 'A4', marcaId: marcaMap['Audi'] },
      { nome: 'A5', marcaId: marcaMap['Audi'] },
      { nome: 'Q3', marcaId: marcaMap['Audi'] },
      { nome: 'Q5', marcaId: marcaMap['Audi'] },
      { nome: 'e-tron', marcaId: marcaMap['Audi'] },

      // BMW
      { nome: '320i', marcaId: marcaMap['BMW'] },
      { nome: 'M3', marcaId: marcaMap['BMW'] },
      { nome: 'X1', marcaId: marcaMap['BMW'] },
      { nome: 'X3', marcaId: marcaMap['BMW'] },
      { nome: 'X5', marcaId: marcaMap['BMW'] },
      { nome: 'Z4', marcaId: marcaMap['BMW'] },

      // Caoa Chery
      { nome: 'Arrizo 6', marcaId: marcaMap['Caoa Chery'] },
      { nome: 'Tiggo 5X', marcaId: marcaMap['Caoa Chery'] },
      { nome: 'Tiggo 7 Pro', marcaId: marcaMap['Caoa Chery'] },
      { nome: 'Tiggo 8', marcaId: marcaMap['Caoa Chery'] },

      // Chevrolet
      { nome: 'Cruze', marcaId: marcaMap['Chevrolet'] },
      { nome: 'Equinox', marcaId: marcaMap['Chevrolet'] },
      { nome: 'Montana', marcaId: marcaMap['Chevrolet'] },
      { nome: 'Onix', marcaId: marcaMap['Chevrolet'] },
      { nome: 'Onix Plus', marcaId: marcaMap['Chevrolet'] },
      { nome: 'S10', marcaId: marcaMap['Chevrolet'] },
      { nome: 'Spin', marcaId: marcaMap['Chevrolet'] },
      { nome: 'Tracker', marcaId: marcaMap['Chevrolet'] },

      // Citroën
      { nome: 'C3', marcaId: marcaMap['Citroën'] },
      { nome: 'C4 Cactus', marcaId: marcaMap['Citroën'] },
      { nome: 'Jumpy', marcaId: marcaMap['Citroën'] },

      // Fiat
      { nome: 'Argo', marcaId: marcaMap['Fiat'] },
      { nome: 'Cronos', marcaId: marcaMap['Fiat'] },
      { nome: 'Fastback', marcaId: marcaMap['Fiat'] },
      { nome: 'Mobi', marcaId: marcaMap['Fiat'] },
      { nome: 'Pulse', marcaId: marcaMap['Fiat'] },
      { nome: 'Strada', marcaId: marcaMap['Fiat'] },
      { nome: 'Toro', marcaId: marcaMap['Fiat'] },

      // Ford
      { nome: 'Bronco Sport', marcaId: marcaMap['Ford'] },
      { nome: 'Maverick', marcaId: marcaMap['Ford'] },
      { nome: 'Mustang', marcaId: marcaMap['Ford'] },
      { nome: 'Ranger', marcaId: marcaMap['Ford'] },
      { nome: 'Territory', marcaId: marcaMap['Ford'] },
      { nome: 'Transit', marcaId: marcaMap['Ford'] },

      // Honda
      { nome: 'City', marcaId: marcaMap['Honda'] },
      { nome: 'City Hatchback', marcaId: marcaMap['Honda'] },
      { nome: 'Civic', marcaId: marcaMap['Honda'] },
      { nome: 'HR-V', marcaId: marcaMap['Honda'] },
      { nome: 'ZR-V', marcaId: marcaMap['Honda'] },

      // Hyundai
      { nome: 'Creta', marcaId: marcaMap['Hyundai'] },
      { nome: 'HB20', marcaId: marcaMap['Hyundai'] },
      { nome: 'HB20S', marcaId: marcaMap['Hyundai'] },
      { nome: 'Tucson', marcaId: marcaMap['Hyundai'] },

      // Jeep
      { nome: 'Commander', marcaId: marcaMap['Jeep'] },
      { nome: 'Compass', marcaId: marcaMap['Jeep'] },
      { nome: 'Gladiator', marcaId: marcaMap['Jeep'] },
      { nome: 'Renegade', marcaId: marcaMap['Jeep'] },

      // Kia
      { nome: 'Niro', marcaId: marcaMap['Kia'] },
      { nome: 'Sportage', marcaId: marcaMap['Kia'] },
      { nome: 'Stonic', marcaId: marcaMap['Kia'] },

      // Land Rover
      { nome: 'Defender', marcaId: marcaMap['Land Rover'] },
      { nome: 'Discovery', marcaId: marcaMap['Land Rover'] },
      { nome: 'Range Rover Evoque', marcaId: marcaMap['Land Rover'] },
      { nome: 'Range Rover Velar', marcaId: marcaMap['Land Rover'] },

      // Mercedes-Benz
      { nome: 'Classe A', marcaId: marcaMap['Mercedes-Benz'] },
      { nome: 'Classe C', marcaId: marcaMap['Mercedes-Benz'] },
      { nome: 'Classe E', marcaId: marcaMap['Mercedes-Benz'] },
      { nome: 'GLA', marcaId: marcaMap['Mercedes-Benz'] },
      { nome: 'GLC', marcaId: marcaMap['Mercedes-Benz'] },

      // Mitsubishi
      { nome: 'Eclipse Cross', marcaId: marcaMap['Mitsubishi'] },
      { nome: 'L200 Triton', marcaId: marcaMap['Mitsubishi'] },
      { nome: 'Outlander', marcaId: marcaMap['Mitsubishi'] },
      { nome: 'Pajero Sport', marcaId: marcaMap['Mitsubishi'] },

      // Nissan
      { nome: 'Frontier', marcaId: marcaMap['Nissan'] },
      { nome: 'Kicks', marcaId: marcaMap['Nissan'] },
      { nome: 'Sentra', marcaId: marcaMap['Nissan'] },
      { nome: 'Versa', marcaId: marcaMap['Nissan'] },

      // Peugeot
      { nome: '2008', marcaId: marcaMap['Peugeot'] },
      { nome: '208', marcaId: marcaMap['Peugeot'] },
      { nome: '3008', marcaId: marcaMap['Peugeot'] },
      { nome: 'Partner Rapid', marcaId: marcaMap['Peugeot'] },

      // Renault
      { nome: 'Captur', marcaId: marcaMap['Renault'] },
      { nome: 'Duster', marcaId: marcaMap['Renault'] },
      { nome: 'Kwid', marcaId: marcaMap['Renault'] },
      { nome: 'Oroch', marcaId: marcaMap['Renault'] },
      { nome: 'Sandero', marcaId: marcaMap['Renault'] },

      // Toyota
      { nome: 'Corolla', marcaId: marcaMap['Toyota'] },
      { nome: 'Corolla Cross', marcaId: marcaMap['Toyota'] },
      { nome: 'Hilux', marcaId: marcaMap['Toyota'] },
      { nome: 'SW4', marcaId: marcaMap['Toyota'] },
      { nome: 'Yaris', marcaId: marcaMap['Toyota'] },
      { nome: 'Yaris Sedan', marcaId: marcaMap['Toyota'] },

      // Volkswagen
      { nome: 'Amarok', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Gol', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Jetta', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Nivus', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Polo', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Saveiro', marcaId: marcaMap['Volkswagen'] },
      { nome: 'T-Cross', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Taos', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Virtus', marcaId: marcaMap['Volkswagen'] },
      { nome: 'Voyage', marcaId: marcaMap['Volkswagen'] },

      // Volvo
      { nome: 'C40', marcaId: marcaMap['Volvo'] },
      { nome: 'XC40', marcaId: marcaMap['Volvo'] },
      { nome: 'XC60', marcaId: marcaMap['Volvo'] },
      { nome: 'XC90', marcaId: marcaMap['Volvo'] },
    ];

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