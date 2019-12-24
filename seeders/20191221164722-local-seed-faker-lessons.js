"use strict";
const faker = require("faker");

// array for bulkinsert
let lessons = [];
for (let i = 0; i < 241; i++) {
  for (let j = 1; j < 11; j++) {
    lessons.push({
      lessonNumber: j,
      intro: faker.lorem.sentence(),
      title: faker.lorem.words(),
      contents: faker.lorem.paragraphs(),
      image: faker.image.imageUrl(),
      totalTime: Math.round(faker.random.number() / 10),
      isPreview: true,
      visible: true,
      CourseId: i,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Lessons", lessons);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Lessons", null, {});
  }
};
