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
          username: "root",
          email: "root@example.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: faker.image.imageUrl(),
          description: faker.lorem.text().substring(0, 200),
          role: "admin",
          country: "Taiwan",
          timezone: "Asia/Taipei",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "user1",
          email: "user1@example.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: faker.image.imageUrl(),
          description: faker.lorem.text().substring(0, 200),
          role: "user",
          country: "Taiwan",
          timezone: "Asia/Taipei",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "user2",
          email: "user2@example.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: faker.image.imageUrl(),
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
    return queryInterface.bulkInsert(
      "Users",
      Array.from({ length: 5 }).map(d => ({
        username: faker.name.findName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
        avatar: faker.image.imageUrl(),
        description: faker.lorem.text().substring(0, 200),
        role: "user",
        country: "Taiwan",
        timezone: "Asia/Taipei",
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
