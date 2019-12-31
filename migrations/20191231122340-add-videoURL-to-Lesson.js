'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Lessons', 'videoURL', {
        type: Sequelize.STRING
      }, {
        after: 'contents' // after option is only supported by MySQL
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Lessons', 'videoURL')
    ])
  }
};
