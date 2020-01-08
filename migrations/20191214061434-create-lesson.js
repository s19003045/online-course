'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Lessons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lessonNumber: {
        type: Sequelize.INTEGER
      },
      intro: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      contents: {
        type: Sequelize.TEXT('long')
      },
      image: {
        type: Sequelize.STRING
      },
      totalTime: {
        type: Sequelize.INTEGER
      },
      isPreview: {
        type: Sequelize.BOOLEAN
      },
      visible: {
        type: Sequelize.BOOLEAN,
      },
      CourseId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Lessons');
  }
};