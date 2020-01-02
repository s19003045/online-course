"use strict";
const faker = require("faker");

// 為每一門課程產生discussion replies
let replies = [];
for (let i = 1; i < 241; i++) {
  for (let j = 1; j < 3; j += 1) {
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
