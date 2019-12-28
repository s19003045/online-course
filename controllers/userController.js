const db = require("../models");
const Course = db.Course;
const User = db.User;
const UserEnrollment = db.UserEnrollment;
const Lesson = db.Lesson;
const Favorite = db.Favorite;

const userController = {
  // 登入/註冊/登出
  signUpPage: (req, res) => {
    return res.render("signup");
  },
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "兩次密碼輸入不同！");
      return res.redirect("/signup");
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash("error_messages", "信箱重複！");
          return res.redirect("/signup");
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          }).then(user => {
            req.flash("success_messages", "成功註冊帳號！");
            return res.redirect("/signin");
          });
        }
      });
    }
  },

  signInPage: (req, res) => {
    return res.render("signin");
  },

  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！");
    res.redirect("/courses");
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/signin");
  },
  // 開課者可以瀏灠自己開的課及相關資訊
  getTeachCourses: (req, res) => {
    Course.findAll({
      where: { UserId: 1 },
      // attributes: ['id', 'name', 'UserId'],
      include: [
        db.User,
        db.CourseCategory,
        db.Rating,
        {
          model: db.UserEnrollment,
          include: [
            {
              model: db.User
            }
          ]
        }
      ]
    }).then(courses => {
      return res.json(courses);
    });
  },
  addFavoriteCourse: (req, res) => {
    Course.findByPk(req.params.courses_id).then(course => {
      if (course) {
        // 判別使用者是否已收藏該課程
        Favorite.findOne({
          where: {
            CourseId: course.id,
            UserId: req.user.id
          }
        }).then(favorite => {
          if (favorite) {
            req.flash("error_messages", "該課程已在您的收藏清單");
            res.redirect("back");
          } else {
            // 新增資料至favorite model
            Favorite.create({
              CourseId: course.id,
              UserId: req.user.id
            }).then(user => {
              req.flash("success_messages", `成功新增${course.name}至收藏清單`);
              res.redirect("back");
            });
          }
        });
      } else {
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
    });
  },
  getBoughtCourses: (req, res) => {
    UserEnrollment.findAll({
      where: {
        UserId: req.user.id
      },
      include: [Course]
    }).then(courses => {
      return res.render("boughtCourses", { courses });
    });
  }
};

module.exports = userController;
