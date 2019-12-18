const db = require("../models");
const Course = db.Course;
const CourseCategory = db.CourseCategory;

const courseController = {
  getCourses: (req, res) => {
    // 取得sort功能要依據哪個變數排序所有課程
    let order = "intoMarketDate";
    if (req.query.order === "評價由高到低") {
      order = ["ratingAverage", "DESC"];
    }
    if (req.query.order === "學生人數由多到少") {
      order = ["studentCount", "DESC"];
    }
    if (req.query.order === "評價人數由多到少") {
      order = ["ratingCount", "DESC"];
    }
    if (req.query.order === "課程時數由多到少") {
      order = ["totalTime", "DESC"];
    }
    if (req.query.order === "課程時數由少到多") {
      order = ["totalTime", "ASC"];
    }
    if (req.query.order === "價格由高到低") {
      order = ["price", "DESC"];
    }
    if (req.query.order === "價格由低到高") {
      order = ["price", "ASC"];
    }

    if (!req.query.mainCategoName || !req.query.subCategoName) {
      // 沒有選擇課程類別，撈出全部課程資料
      Course.findAll({
        attributes: [
          "name",
          "ratingAverage",
          "ratingCount",
          "studentCount",
          "totalTime",
          "price"
        ],
        where: [{ status: "intoMarket" }],
        order: [order]
      }).then(courses => {
        return res.render("courses", { courses });
        // return res.json(courses);
      });
    } else {
      // 選擇某個類別的課程資料
      CourseCategory.findOne({
        where: {
          mainCategoName: req.query.mainCategoName,
          subCategoName: req.query.subCategoName
        }
      }).then(category => {
        Course.findAll({
          attributes: [
            "name",
            "ratingAverage",
            "ratingCount",
            "studentCount",
            "totalTime",
            "price"
          ],
          where: [{ status: "intoMarket" }, { CourseCategoryId: category.id }],
          order: [order]
        }).then(courses => {
          return res.render("courses", { courses });
          // return res.json(courses);
        });
      });
    }
  }
};

module.exports = courseController;
