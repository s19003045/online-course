"use strict";

let lessonusers = [];
for (let i = 1201; i < 2001; i++) {
  for (let j = 1; j < 3; j++) {
    lessonusers.push({
      isfinished: false,
      LessonId: i,
      UserId: j,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("LessonUsers", lessonusers, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("LessonUsers", null, {});
  }
};
