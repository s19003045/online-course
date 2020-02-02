'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('CartItems', 'status', {
        type: Sequelize.ENUM('offCart', 'inCart', 'toOrder'),
        after: 'id' // after option is only supported by MySQL
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('CartItems', 'status')
    ])
  }
};
