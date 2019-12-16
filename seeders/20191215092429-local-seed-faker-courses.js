'use strict';
const faker = require("faker");
const bcrypt = require("bcrypt-nodejs");
const courseStatus = ['editted', 'submitted', 'offMarket']
const submittedDate = []
const intoMarketDate = []

let i
for (i = 0; i < 50; i++) {
  submittedDate.push(faker.date.past())
}
for (i = 0; i < 50; i++) {
  intoMarketDate.push(faker.date.future())
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 建立50個假課程資料(已上架)
    queryInterface.bulkInsert(
      "Courses",
      Array.from({ length: 50 }).map(d => ({
        name: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        image: faker.image.imageUrl(),
        introVideo: 'https://youtu.be/PkZNo7MFNFg',
        teacherName: faker.name.findName(),
        teacherDescrip: faker.lorem.sentence(),
        totalTime: Math.floor(Math.random() * 20) * 40, //單位(minutes)
        totalLessons: Math.floor(Math.random() * 20),
        price: Math.floor(Math.random() * 5000),
        status: 'intoMarket',
        submittedDate: submittedDate[Math.floor(Math.random() * submittedDate.length)],
        intoMarketDate: intoMarketDate[Math.floor(Math.random() * intoMarketDate.length)],
        ratingAverage: Math.random() * 5,
        ratingCount: Math.floor(Math.random() * 200),
        studentCount: Math.floor(Math.random() * 1000),
        CourseCategoId: Math.floor(Math.random() * 20) + 1,  //1 ~ 20
        TeacherId: Math.floor(Math.random() * 5) + 1,  //1 ~ 5
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
    // 建立50個假課程資料(未上架，包含'editted', 'submitted', 'offMarket')
    return queryInterface.bulkInsert(
      "Courses",
      Array.from({ length: 50 }).map(d => ({
        name: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        image: faker.image.imageUrl(),
        introVideo: 'https://youtu.be/PkZNo7MFNFg',
        teacherName: faker.name.findName(),
        teacherDescrip: faker.lorem.sentence(),
        totalTime: Math.floor(Math.random() * 20) * 40, //單位(minutes)
        totalLessons: Math.floor(Math.random() * 20),
        price: Math.floor(Math.random() * 5000),
        status: courseStatus[Math.floor(Math.random() * courseStatus.length)],
        submittedDate: submittedDate[Math.floor(Math.random() * submittedDate.length)],
        // intoMarketDate: intoMarketDate,
        // ratingAverage: Math.random() * 5,
        // ratingCount: Math.floor(Math.random() * 200),
        // studentCount: Math.floor(Math.random() * 1000),
        CourseCategoId: Math.floor(Math.random() * 20) + 1,  //1 ~ 20
        TeacherId: Math.floor(Math.random() * 5) + 1,  //1 ~ 5
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Courses", null, {});
  }
};
