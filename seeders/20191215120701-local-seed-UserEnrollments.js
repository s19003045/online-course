"use strict";
const faker = require("faker");

let userenrollments = [];
for (let i = 121; i < 201; i++) {
  for (let j = 1; j < 3; j++) {
    userenrollments.push({
      timeStart: faker.date.past(),
      finishLessonCount: 0,
      completeRate: 0,
      CourseId: i,
      UserId: j,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("UserEnrollments", userenrollments, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("UserEnrollments", null, {});
  }
};
