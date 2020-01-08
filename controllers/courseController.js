const db = require("../models");
const Course = db.Course;
const User = db.User;
const UserEnrollment = db.UserEnrollment;
const Lesson = db.Lesson;
const LessonUser = db.LessonUser;
const CourseCategory = db.CourseCategory;
const CourseSubCategory = db.CourseSubCategory;
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const helpers = require("../_helpers");

const courseController = {
  // 看單一課程介紹
  getCourseIntro: (req, res) => {
    Course.findByPk(req.params.courses_id, {
      include: User
    }).then(course => {
      if (course) {
        res.render("course-intro", { course });
      } else {
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
    });
  },
  // 看單一課程內容
  getCourseLesson: (req, res) => {
    let lessonNumber = 1;
    if (req.query.lessonNumber) {
      lessonNumber = Number(req.query.lessonNumber);
    }
    Course.findByPk(req.params.courses_id).then(course => {
      if (course) {
        Lesson.findAll({
          attributes: ["lessonNumber", "title"],
          where: [{ visible: true }, { CourseId: course.id }]
        }).then(lessons => {
          Lesson.findOne({
            where: {
              lessonNumber: lessonNumber,
              CourseId: course.id
            },
            include: [{ model: LessonUser, where: { UserId: req.user.id } }]
          }).then(lesson => {
            let isfinished = false;
            if (lesson.LessonUsers) {
              isfinished = lesson.LessonUsers[0].isfinished;
            }
            res.render("course", {
              lesson,
              lessons,
              courseId: course.id,
              courseName: course.name,
              lessonNumber,
              isfinished: isfinished
            });
          });
        });
      } else {
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
    });
  },
  // (首頁)看所有課程
  getCourses: (req, res) => {
    // 取得sort功能要依據哪個變數排序所有課程
    let order = ["intoMarketDate", "DESC"];
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
          "id",
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
        return res.render("courses", {
          courses,
          order: req.query.order,
          route: "all",
          reqUrl: req.url
        });
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
        // 找不到類別
        if (!category) {
          // 目前req.flash無法顯示，待解決
          req.flash(
            "error_messages",
            "目前還沒有該類別的課程，本站將陸續新增，不好意思！"
          );
          res.redirect("/courses");
        } else {
          Course.findAll({
            attributes: [
              "id",
              "name",
              "ratingAverage",
              "ratingCount",
              "studentCount",
              "totalTime",
              "price"
            ],
            where: [
              { status: "intoMarket" },
              { CourseCategoryId: category.id }
            ],
            order: [order]
          }).then(courses => {
            // 該類別沒有任何課程
            if (courses.length === 0) {
              let no_courses = true;
              return res.render("courses", { no_courses });
            }
            return res.render("courses", {
              courses,
              order: req.query.order,
              route: "subCate",
              mainCategoName: req.query.mainCategoName,
              subCategoName: req.query.subCategoName,
              reqUrl: req.url
            });
            // return res.json(courses);
          });
        }
      });
    }
  },
  // 依主類別篩選課程
  getMainCategoryCourse: (req, res) => {
    // 取得sort功能要依據哪個變數排序所有課程
    let order = ["intoMarketDate", "DESC"];
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

    CourseCategory.findOne({
      where: {
        name: req.params.mainCategoName
      }
    }).then(category => {
      // 找不到類別
      if (!category) {
        // 目前req.flash無法顯示，待解決
        req.flash(
          "error_messages",
          "目前還沒有該類別的課程，本站將陸續新增，不好意思！"
        );
        res.redirect("/courses");
      } else {
        Course.findAll({
          attributes: [
            "id",
            "name",
            "ratingAverage",
            "ratingCount",
            "studentCount",
            "totalTime",
            "price",
            "CourseCategoryId"
          ],
          where: [{ status: "intoMarket" }, { CourseCategoryId: category.id }],
          order: [order]
        }).then(courses => {
          // 該類別沒有任何課程
          if (courses.length === 0) {
            let no_courses = true;
            return res.render("courses", { no_courses });
          }
          return res.render("courses", {
            courses,
            order: req.query.order,
            route: "mainCate",
            mainCategoName: req.params.mainCategoName,
            reqUrl: req.url
          });
          // return res.json(courses);
        });
      }
    });
  },
  // 依次類別篩選課程
  getSubCategoryCourse: (req, res) => {
    // 取得sort功能要依據哪個變數排序所有課程
    let order = ["intoMarketDate", "DESC"];
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

    CourseCategory.findOne({
      where: {
        name: req.params.mainCategoName
      }
    }).then(category => {
      // 找不到類別
      if (!category) {
        // 目前req.flash無法顯示，待解決
        req.flash(
          "error_messages",
          "目前還沒有該類別的課程，本站將陸續新增，不好意思！"
        );
        res.redirect("/courses");
      } else {
        CourseSubCategory.findOne({
          where: { name: req.params.subCategoName }
        }).then(subcategory => {
          if (!subcategory) {
            // 目前req.flash無法顯示，待解決
            req.flash(
              "error_messages",
              "目前還沒有該類別的課程，本站將陸續新增，不好意思！"
            );
            res.redirect("/courses");
          } else {
            Course.findAll({
              attributes: [
                "id",
                "name",
                "ratingAverage",
                "ratingCount",
                "studentCount",
                "totalTime",
                "price",
                "CourseCategoryId"
              ],
              where: [
                { status: "intoMarket" },
                { CourseCategoryId: category.id },
                { CourseSubCategoryId: subcategory.id }
              ],
              order: [order]
            }).then(courses => {
              // 該類別沒有任何課程
              if (courses.length === 0) {
                let no_courses = true;
                return res.render("courses", { no_courses });
              }
              return res.render("courses", {
                courses,
                order: req.query.order,
                route: "subCate",
                mainCategoName: req.params.mainCategoName,
                subCategoName: req.params.subCategoName,
                reqUrl: req.url
              });
              // return res.json(courses);
            });
          }
        });
      }
    });
  },

};

module.exports = courseController;
