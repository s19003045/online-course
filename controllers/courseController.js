const db = require("../models");
const Course = db.Course;
const User = db.User;
const UserEnrollment = db.UserEnrollment;
const Lesson = db.Lesson;
const LessonUser = db.LessonUser;
const CourseCategory = db.CourseCategory;
const CourseSubCategory = db.CourseSubCategory;
const Cart = db.Cart;
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const helpers = require("../_helpers");
const SortCourses = require("../public/js/sort_courses");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
    // 取得 courseId
    let courseId = req.params.courses_id
    // 登入使用者已購買的課程Id
    let userEnrolledId = [];
    if (req.user) {
      req.user.UserEnrollments.forEach(enroll => {
        userEnrolledId.push(enroll.CourseId);
      });
    }
    // 使用者未購買該課程
    if (userEnrolledId.indexOf(parseInt(req.params.courses_id)) === -1) {
      req.flash("error_messages", "您尚未購買此課程，無法觀看課程內容");
      return res.redirect(`/courses/${courseId}/introduction`);
    } else {
      // 使用者已購買該課程
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
          return res.redirect('back');
        }
      });
    }
  },
  // (首頁)看所有課程
  getCourses: (req, res) => {
    // 登入使用者已購買的課程Id
    let userEnrolledId = [];
    if (req.user) {
      req.user.UserEnrollments.forEach(enroll => {
        userEnrolledId.push(enroll.CourseId);
      });
    }
    // 取得sort功能要依據哪個變數排序所有課程
    order = SortCourses(req.query.order);
    Course.findAll({
      attributes: [
        "id",
        "image",
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
      // 辨認課程是否被登入的使用者購買
      const data = courses.map(c => ({
        ...c.dataValues,
        enrolled: userEnrolledId.includes(c.dataValues.id)
      }));

      if (!req.user) {
        return Cart.findOne({
          where: {
            id: req.session.cartId
          },
          include: [{
            model: Course,
            as: 'items',
            attributes: ['id']
          }]
        })
          .then(cart => {
            // 購物車中商品數量
            let cartItemCount
            let cartCountDisplay
            if (cart) {
              cartItemCount = cart.items === undefined ? 0 : cart.items.length
            } else {
              cartItemCount = 0
            }
            // 購物車的商品數是否要顯示
            cartCountDisplay = cartItemCount === 0 ? false : true

            return res.render("courses", {
              courses: data,
              order: req.query.order,
              route: "all",
              reqUrl: req.url,
              cartItemCount,
              cartCountDisplay
            });
          })
      } else {
        User.findByPk(req.user.id).then(user => {
          return Cart.findOne({
            where: {
              UserId: req.user.id
            },
            include: [{
              model: Course,
              as: 'items',
              attributes: ['id']
            }]
          })
            .then(cart => {
              // 購物車中商品數量
              let cartItemCount
              let cartCountDisplay
              if (cart) {
                cartItemCount = cart.items === undefined ? 0 : cart.items.length
              } else {
                cartItemCount = 0
              }
              // 購物車的商品數是否要顯示
              cartCountDisplay = cartItemCount === 0 ? false : true
              console.log('---------')
              console.log(cartItemCount)
              console.log('---------')
              console.log(cartCountDisplay)
              return res.render("courses", {
                courses: data,
                order: req.query.order,
                route: "all",
                reqUrl: req.url,
                cartItemCount,
                cartCountDisplay
              });
            })
        });
      }
    });
  },
  // 依主類別篩選課程
  getMainCategoryCourse: (req, res) => {
    // 登入使用者已購買的課程Id
    let userEnrolledId = [];
    if (req.user) {
      req.user.UserEnrollments.forEach(enroll => {
        userEnrolledId.push(enroll.CourseId);
      });
    }
    // 取得sort功能要依據哪個變數排序所有課程
    order = SortCourses(req.query.order);
    CourseCategory.findOne({
      where: {
        name: req.params.mainCategoName
      }
    }).then(category => {
      // 找不到類別
      if (!category) {
        req.flash("error_messages", "目前尚未規劃該類別，本站將陸續新增！");
        res.redirect("/courses");
      } else {
        Course.findAll({
          attributes: [
            "id",
            "image",
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
            req.flash(
              "error_messages",
              "目前該類別還沒有任何課程，本站將陸續新增！"
            );
            res.redirect("/courses");
          } else {
            // 辨認課程是否被登入的使用者購買
            const data = courses.map(c => ({
              ...c.dataValues,
              enrolled: userEnrolledId.includes(c.dataValues.id)
            }));
            return res.render("courses", {
              courses: data,
              order: req.query.order,
              route: "mainCate",
              mainCategoName: req.params.mainCategoName,
              reqUrl: req.url
            });
          }
        });
      }
    });
  },
  // 依次類別篩選課程
  getSubCategoryCourse: (req, res) => {
    // 登入使用者已購買的課程Id
    let userEnrolledId = [];
    if (req.user) {
      req.user.UserEnrollments.forEach(enroll => {
        userEnrolledId.push(enroll.CourseId);
      });
    }
    // 取得sort功能要依據哪個變數排序所有課程
    order = SortCourses(req.query.order);
    CourseCategory.findOne({
      where: {
        name: req.params.mainCategoName
      }
    }).then(category => {
      // 找不到類別
      if (!category) {
        req.flash("error_messages", "目前尚未規劃該類別，本站將陸續新增！");
        res.redirect("/courses");
      } else {
        CourseSubCategory.findOne({
          where: { name: req.params.subCategoName }
        }).then(subcategory => {
          if (!subcategory) {
            req.flash(
              "error_messages",
              "目前還沒有該類別的課程，本站將陸續新增，不好意思！"
            );
            res.redirect("/courses");
          } else {
            // 依子類別撈取課程資料
            Course.findAll({
              attributes: [
                "id",
                "image",
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
                req.flash(
                  "error_messages",
                  "目前該類別還沒有任何課程，本站將陸續新增！"
                );
                res.redirect("/courses");
              } else {
                // 辨認課程是否被登入的使用者購買
                const data = courses.map(c => ({
                  ...c.dataValues,
                  enrolled: userEnrolledId.includes(c.dataValues.id)
                }));
                return res.render("courses", {
                  courses: data,
                  order: req.query.order,
                  route: "subCate",
                  mainCategoName: req.params.mainCategoName,
                  subCategoName: req.params.subCategoName,
                  reqUrl: req.url
                });
              }
            });
          }
        });
      }
    });
  },
  getSearchCourses: (req, res) => {
    // 登入使用者已購買的課程Id
    let userEnrolledId = [];
    if (req.user) {
      req.user.UserEnrollments.forEach(enroll => {
        userEnrolledId.push(enroll.CourseId);
      });
    }
    // 取得sort功能要依據哪個變數排序所有課程
    order = SortCourses(req.query.order);
    Course.findAll({
      attributes: [
        "id",
        "image",
        "name",
        "ratingAverage",
        "ratingCount",
        "studentCount",
        "totalTime",
        "price"
      ],
      where: [
        { status: "intoMarket" },
        {
          name: {
            [Op.like]: `%${req.query.keyword}%`
          }
        }
      ],
      order: [order]
    }).then(courses => {
      // 辨認課程是否被登入的使用者購買
      const data = courses.map(c => ({
        ...c.dataValues,
        enrolled: userEnrolledId.includes(c.dataValues.id)
      }));
      if (!req.user) {
        return res.render("courses", {
          courses: data,
          order: req.query.order,
          route: "search",
          reqUrl: req.url,
          keyword: req.query.keyword
        });
      } else {
        User.findByPk(req.user.id).then(user => {
          return res.render("courses", {
            courses: data,
            order: req.query.order,
            route: "search",
            reqUrl: req.url,
            keyword: req.query.keyword,
            user
          });
        });
      }
    });
  }
};

module.exports = courseController;
