'use strict';
const faker = require("faker");
const bcrypt = require("bcrypt-nodejs");
const courseStatus = ['editted', 'submitted', 'offMarket']
const submittedDate = []
const intoMarketDate = []
const autoIncrementNum = 1 //local DB 設定1，若為 heroku mySQL DB 則須改為10

let i, j, k
for (i = 0; i < 50; i++) {
  submittedDate.push(faker.date.past())
}
for (i = 0; i < 50; i++) {
  intoMarketDate.push(faker.date.future())
}

//courseId 為各主類別建置在資料庫的 id
//courseNum 為各主類別的次類別數
const courses = [
  { name: '程式', courseId: 1 + autoIncrementNum * 0, courseNum: 7 },
  { name: '職場技能', courseId: 1 + autoIncrementNum * 1, courseNum: 5 },
  { name: '設計', courseId: 1 + autoIncrementNum * 2, courseNum: 4 },
  { name: '投資理財', courseId: 1 + autoIncrementNum * 3, courseNum: 4 },
  { name: '生活品味', courseId: 1 + autoIncrementNum * 4, courseNum: 4 }
]

// 已上架的課程
const coursesIntoMarket = []

// 初始化 subCategoryId
let subCategoryIdStart = 0

for (i = 0; i < courses.length; i++) {
  for (j = 0; j < courses[i].courseNum; j++) {
    // 每個次類別的課程各有5堂課
    for (k = 0; k < 5; k++) {
      coursesIntoMarket.push(
        {
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
          CourseCategoryId: i + 1,
          CourseSubCategoryId: 1 + subCategoryIdStart * autoIncrementNum,
          UserId: Math.floor(Math.random() * 5) + 1,  //1 ~ 5
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    }
    subCategoryIdStart++
  }
}

// 未上架的課程
const coursesNotIntoMarket = []
// 初始化 subCategoryId
subCategoryIdStart = 0

for (i = 0; i < courses.length; i++) {
  for (j = 0; j < courses[i].courseNum; j++) {
    // 每個次類別的課程各有5堂課
    for (k = 0; k < 5; k++) {
      coursesNotIntoMarket.push(
        {
          name: faker.lorem.sentence(),
          description: faker.lorem.sentence(),
          image: faker.image.imageUrl(),
          introVideo: 'https://youtu.be/PkZNo7MFNFg',
          teacherName: faker.name.findName(),
          teacherDescrip: faker.lorem.sentence(),
          totalTime: Math.floor(Math.random() * 20) * 40, //單位(minutes)
          // totalLessons: Math.floor(Math.random() * 20),
          price: Math.floor(Math.random() * 5000),
          status: courseStatus[Math.floor(Math.random() * courseStatus.length)],
          // submittedDate: submittedDate[Math.floor(Math.random() * submittedDate.length)],
          // intoMarketDate: intoMarketDate[Math.floor(Math.random() * intoMarketDate.length)],
          // ratingAverage: Math.random() * 5,
          // ratingCount: Math.floor(Math.random() * 200),
          // studentCount: Math.floor(Math.random() * 1000),
          CourseCategoryId: i + 1,
          CourseSubCategoryId: 1 + subCategoryIdStart * autoIncrementNum,
          UserId: Math.floor(Math.random() * 5) + 1,  //1 ~ 5
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    }
    subCategoryIdStart++
  }
}


module.exports = {
  up: (queryInterface, Sequelize) => {
    // 建立 N 個假課程資料(已上架)
    queryInterface.bulkInsert(
      "Courses",
      coursesIntoMarket,
      {}
    );
    // 建立 N 個假課程資料(未上架，包含'editted', 'submitted', 'offMarket')
    return queryInterface.bulkInsert(
      "Courses",
      coursesNotIntoMarket,
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Courses", null, {});
  }
};
