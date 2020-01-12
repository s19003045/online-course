"use strict";
const courses = require("../true_seeds/courses.js");

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 建立 N 個假課程資料(已上架)
    return queryInterface.bulkInsert("Courses", courses, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Courses", null, {});
  }
};
