"use strict";
const faker = require("faker");
const bcrypt = require("bcrypt-nodejs");
const autoIncrementNum = 1; //local DB 設定1，若為 heroku mySQL DB 則須改為10

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert("courseCategories", [
      {
        name: "程式",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "職場技能",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "設計",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "投資理財",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "生活品味",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    return queryInterface.bulkInsert("courseSubCategories", [
      // 程式 7 個
      {
        name: "區塊鏈",
        CourseCategoryId: 1 + autoIncrementNum * 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "程式入門",
        CourseCategoryId: 1 + autoIncrementNum * 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "網站架設",
        CourseCategoryId: 1 + autoIncrementNum * 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "網頁前端",
        CourseCategoryId: 1 + autoIncrementNum * 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "網頁後端",
        CourseCategoryId: 1 + autoIncrementNum * 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "手機程式開發",
        CourseCategoryId: 1 + autoIncrementNum * 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "程式語言",
        CourseCategoryId: 1 + autoIncrementNum * 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 職場技能 5 個
      {
        name: "效率提升",
        CourseCategoryId: 1 + autoIncrementNum * 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "求職",
        CourseCategoryId: 1 + autoIncrementNum * 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "創業",
        CourseCategoryId: 1 + autoIncrementNum * 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "職場溝通",
        CourseCategoryId: 1 + autoIncrementNum * 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "文書處理",
        CourseCategoryId: 1 + autoIncrementNum * 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 設計 4 個
      {
        name: "動態設計",
        CourseCategoryId: 1 + autoIncrementNum * 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "平面設計",
        CourseCategoryId: 1 + autoIncrementNum * 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "應用設計",
        CourseCategoryId: 1 + autoIncrementNum * 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "網頁設計",
        CourseCategoryId: 1 + autoIncrementNum * 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 投資理財 4 個
      {
        name: "理財",
        CourseCategoryId: 1 + autoIncrementNum * 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "投資觀念",
        CourseCategoryId: 1 + autoIncrementNum * 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "金融商品",
        CourseCategoryId: 1 + autoIncrementNum * 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "量化分析",
        CourseCategoryId: 1 + autoIncrementNum * 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 生活品味 4 個
      {
        name: "運動",
        CourseCategoryId: 1 + autoIncrementNum * 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "寵物",
        CourseCategoryId: 1 + autoIncrementNum * 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "烹飪",
        CourseCategoryId: 1 + autoIncrementNum * 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "教育",
        CourseCategoryId: 1 + autoIncrementNum * 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("courseCategories", null, {});
    return queryInterface.bulkDelete("courseSubCategories", null, {});
  }
};
