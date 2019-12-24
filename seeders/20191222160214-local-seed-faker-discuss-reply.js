"use strict";
const faker = require("faker");

// 為每一門課程產生discussion replies
let replies = [];
for (let i = 1; i < 601; i++) {
  for (let j = 2; j < 4; j++) {
    replies.push({
      message: faker.lorem.sentence(),
      DiscussPostId: i,
      UserId: j,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("DiscussReplies", replies);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("DiscussReplies", null, {});
  }
};
