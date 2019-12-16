"use strict";
const faker = require("faker");
const bcrypt = require("bcrypt-nodejs");

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 建立 24 個分類種子
    return queryInterface.bulkInsert(
      "course_categories",
      [
        // 程式 7 個
        {
          mainCategoName: '程式',
          subCategoName: '區塊鏈',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '程式',
          subCategoName: '程式入門',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '程式',
          subCategoName: '網站架設',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '程式',
          subCategoName: '網頁前端',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '程式',
          subCategoName: '網頁後端',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '程式',
          subCategoName: '手機程式開發',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '程式',
          subCategoName: '程式語言',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // 職場技能 5 個
        {
          mainCategoName: '職場技能',
          subCategoName: '效率提升',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '職場技能',
          subCategoName: '求職',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '職場技能',
          subCategoName: '創業',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '職場技能',
          subCategoName: '職場溝通',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '職場技能',
          subCategoName: '文書處理',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // 設計 4 個
        {
          mainCategoName: '設計',
          subCategoName: '動態設計',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '設計',
          subCategoName: '平面設計',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '設計',
          subCategoName: '應用設計',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '設計',
          subCategoName: '網頁設計',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // 投資理財 4 個
        {
          mainCategoName: '投資理財',
          subCategoName: '理財',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '投資理財',
          subCategoName: '投資觀念',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '投資理財',
          subCategoName: '金融商品',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '投資理財',
          subCategoName: '量化分析',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // 生活品味 4 個
        {
          mainCategoName: '生活品味',
          subCategoName: '運動',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '生活品味',
          subCategoName: '寵物',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '生活品味',
          subCategoName: '烹飪',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '生活品味',
          subCategoName: '數學',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          mainCategoName: '生活品味',
          subCategoName: '教育',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ]
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("course_categories", null, {});
  }
};
