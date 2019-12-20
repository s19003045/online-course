"use strict";
const faker = require("faker");
const bcrypt = require("bcrypt-nodejs");

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 建立 24 個分類種子
    queryInterface.bulkInsert(
      "courseReviewPosts",
      Array.from({ length: 200 }).map(d => ({
        subject: faker.lorem.sentence(),
        message: faker.lorem.text().substring(0, 200),
        CourseId: Math.floor(Math.random() * 50) + 1,
        UserId: Math.floor(Math.random() * 8) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      ,
      {}
    )
    return queryInterface.bulkInsert(
      "courseReviewReplies",
      Array.from({ length: 400 }).map(d => ({
        message: faker.lorem.text().substring(0, 200),
        CourseReviewPostId: Math.floor(Math.random() * 200),
        UserId: Math.floor(Math.random() * 8) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      ,
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("courseReviewPosts", null, {});
    return queryInterface.bulkDelete("courseReviewReplies", null, {});
  }
};
