"use strict";
const faker = require("faker");
const bcrypt = require("bcrypt-nodejs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 建立 root(role:admin), user1(role:user), user2(role:user) 三個 user 種子
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "demo",
          email: "demo@course.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: "https://i.imgur.com/RbiR45N.png",
          description: faker.lorem.text().substring(0, 200),
          role: "admin",
          country: "Taiwan",
          timezone: "Asia/Taipei",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "user1",
          email: "user1@course.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: "https://i.imgur.com/H2NitEZ.png",
          description: faker.lorem.text().substring(0, 200),
          role: "user",
          country: "Taiwan",
          timezone: "Asia/Taipei",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "user2",
          email: "user2@course.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: "https://i.imgur.com/xpbd5t9.png",
          description: faker.lorem.text().substring(0, 200),
          role: "user",
          country: "Taiwan",
          timezone: "Asia/Taipei",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "user3",
          email: "user3@course.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: "https://i.imgur.com/VAdXPCV.png",
          description: faker.lorem.text().substring(0, 200),
          role: "user",
          country: "Taiwan",
          timezone: "Asia/Taipei",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "user4",
          email: "user4@course.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: "https://i.imgur.com/3nxRaKY.png",
          description: faker.lorem.text().substring(0, 200),
          role: "user",
          country: "Taiwan",
          timezone: "Asia/Taipei",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "user5",
          email: "user5@course.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: "https://i.imgur.com/y7tv7B7.png",
          description: faker.lorem.text().substring(0, 200),
          role: "user",
          country: "Taiwan",
          timezone: "Asia/Taipei",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
