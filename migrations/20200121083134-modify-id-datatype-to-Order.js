'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'sn')
    return queryInterface.addColumn('Orders', 'sn', {
      type: Sequelize.BIGINT,
      after: 'id' // after option is only supported by MySQL
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Orders', 'sn')
  }
};
