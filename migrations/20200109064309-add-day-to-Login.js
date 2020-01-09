'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Logins', 'day', {
        type: Sequelize.STRING,
        after: 'loginDate' // after option is only supported by MySQL
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Logins', 'day')
    ])
  }
};
