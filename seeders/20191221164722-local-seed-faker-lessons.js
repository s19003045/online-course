"use strict";
const faker = require("faker");

// array for bulkinsert
let lessons = [];
for (let i = 1; i < 11; i++) {
  lessons.push({
    lessonNumber: i,
    intro: faker.lorem.sentence(),
    title: faker.lorem.words(),
    contents: faker.lorem.paragraphs(),
    image: faker.image.imageUrl(),
    totalTime: Math.round(faker.random.number() / 10),
    isPreview: true,
    visible: true,
    CourseId: 62,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Lessons", lessons);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Lessons", null, {});
  }
};
