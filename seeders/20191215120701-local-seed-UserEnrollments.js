"use strict";
const faker = require("faker");

let data = [];
for (let userid = 1; userid < 3; userid += 1) {
  for (let courseid = 121; courseid < 241; courseid += 1) {
    data.push({
      timeStart: faker.date.past(),
      finishLessonCount: 0,
      completeRate: 0,
      CourseId: courseid,
      UserId: userid,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 建立50個假課程資料(未上架，包含'editted', 'submitted', 'offMarket')
    return queryInterface.bulkInsert("UserEnrollments", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("UserEnrollments", null, {});
  }
};
