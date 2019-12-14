'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      introVideo: {
        type: Sequelize.STRING
      },
      teacherName: {
        type: Sequelize.STRING
      },
      teacherDescrip: {
        type: Sequelize.STRING
      },
      totalTime: {
        type: Sequelize.INTEGER
      },
      totalLessons: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM
      },
      submittedDate: {
        type: Sequelize.DATE
      },
      intoMarketDate: {
        type: Sequelize.DATE
      },
      ratingAverage: {
        type: Sequelize.INTEGER
      },
      ratingCount: {
        type: Sequelize.INTEGER
      },
      studentCount: {
        type: Sequelize.INTEGER
      },
      CourseCategoId: {
        type: Sequelize.INTEGER
      },
      TeacherId: {
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
    return queryInterface.dropTable('Courses');
  }
};