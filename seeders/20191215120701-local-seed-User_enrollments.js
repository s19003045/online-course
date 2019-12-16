'use strict';
const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 建立50個假課程資料(未上架，包含'editted', 'submitted', 'offMarket')
    return queryInterface.bulkInsert(
      "User_enrollments",
      Array.from({ length: 50 }).map(d => ({
        timeStart: faker.date.past(),
        // timeEnd: DataTypes.DATE,
        finishLessonCount: Math.floor(Math.random() * 10),
        completeRate: Math.floor(Math.random() * 100),
        prevReadLessonId: Math.floor(Math.random() * 10) + 5,
        CourseId: Math.floor(Math.random() * 50) + 1,
        UserId: Math.floor(Math.random() * 5) + 2,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("User_enrollments", null, {});
  }
};
