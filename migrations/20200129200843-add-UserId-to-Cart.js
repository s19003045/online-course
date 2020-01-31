'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Carts', 'UserId', {
        type: Sequelize.INTEGER,
        after: 'id' // after option is only supported by MySQL
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Carts', 'UserId')
    ])
  }
};
