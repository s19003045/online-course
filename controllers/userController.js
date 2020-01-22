const db = require("../models");
const Course = db.Course;
const User = db.User;
const UserEnrollment = db.UserEnrollment;
const Lesson = db.Lesson;
const Favorite = db.Favorite;
const LessonUser = db.LessonUser;
const Reward = db.Reward;
const Login = db.Login;
const momentDay = require("../config/handlebars-helpers").momentDay;
const bcrypt = require("bcrypt-nodejs");

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
    console.log('=======req.user.returnUrl in userController.signIn=======')
    console.log(req.user.returnUrl)
    // 取出 req.user.returnUrl (登入前請求的網址)，存成變數
    let returnUrl = req.user.returnUrl

    const loginRewardPoint = 2000;
    req.flash("success_messages", "成功登入！");
    let loginDate = new Date();
    let loginDay = momentDay(loginDate);
    // 記錄登入時間
    return Login.findOne({
      day: loginDay,
      UserId: req.user.id
    }).then(login => {

      // 當天若已登入，則不加點數
      if (login) {
        //先記錄登入時間
        Login.create({
          loginDate: loginDate,
          day: loginDay,
          UserId: req.user.id
        }).then(login => {
          if (returnUrl) {
            return res.redirect(returnUrl)
          } else {
            return res.redirect("/courses");
          }
        });
      } else {
        //當天未登入者，先記錄登入時間，再加點數
        Login.create({
          loginDate: loginDate,
          day: loginDay,
          UserId: req.user.id
        }).then(login => {
          // 當天第一次登入，點數 + 5
          return Reward.findOne({ where: { UserId: req.user.id } }).then(
            reward => {
              if (!reward) {
                return Reward.create({
                  point: loginRewardPoint,
                  UserId: req.user.id
                }).then(reward => {
                  req.flash("success_messages", "今天第一次登入，獲得 5 點");
                  if (returnUrl) {
                    return res.redirect(returnUrl)
                  } else {
                    return res.redirect("/courses");
                  }
                });
              } else {
                return reward
                  .increment("point", { by: loginRewardPoint })
                  .then(reward => {
                    req.flash("success_messages", "今天第一次登入，獲得 5 點");
                    if (returnUrl) {
                      return res.redirect(returnUrl)
                    } else {
                      return res.redirect("/courses");
                    }
                  });
              }
            }
          );
        });
      }
    });
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/signin");
  },

  //使用者可以看個人帳號資訊
  getUser: (req, res) => {
    User.findByPk(req.user.id).then(user => {
      return Reward.findOne({ where: { UserId: req.user.id } }).then(reward => {
        return res.render("user", { user, reward });
      });
    });
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
  // 使用者可以收藏課程
  addFavoriteCourse: (req, res) => {
    Course.findByPk(req.params.courses_id).then(course => {
      if (course) {
        // 判別使用者是否已收藏該課程
        Favorite.findOne({
          where: {
            CourseId: course.id,
            UserId: req.user.id
          },
          include: [Course]
        }).then(favorite => {
          if (favorite) {
            let course_deleted = favorite.Course.name;
            favorite.destroy().then(user => {
              req.flash(
                "success_messages",
                `成功從收藏清單移除${course_deleted}課程`
              );
              res.redirect("back");
            });
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
  // 使用者可以看到已購買的課程
  getBoughtCourses: (req, res) => {
    UserEnrollment.findAll({
      where: {
        UserId: req.user.id
      },
      include: [Course]
    }).then(userenrollments => {
      return res.render("myCourses", { userenrollments });
    });
  },
  // 使用者可以勾選complete checkbox標註已完成的單元
  postFinishLesson: (req, res) => {
    // 登入使用者已購買的課程Id
    let userEnrolledId = [];
    if (req.user) {
      req.user.UserEnrollments.forEach(enroll => {
        userEnrolledId.push(enroll.CourseId);
      });
    }
    // 使用者未購買該課程
    if (userEnrolledId.indexOf(parseInt(req.params.courses_id)) === -1) {
      req.flash("error_messages", "您尚未購買此課程");
      res.redirect("/courses");
    } else {
      // 使用者已購買該課程
      LessonUser.findOne({
        where: {
          LessonId: parseInt(req.params.lesson_id),
          UserId: req.user.id
        }
      }).then(lessonuser => {
        if (lessonuser) {
          lessonuser
            .update({
              isfinished: !lessonuser.isfinished
            })
            .then(user => {
              // 更新completeRate
              Course.findByPk(req.params.courses_id, {
                include: [
                  {
                    model: Lesson,
                    attribute: ["id"],
                    include: [
                      { model: LessonUser, where: { UserId: req.user.id } }
                    ]
                  }
                ]
              }).then(course => {
                let completeLesson = 0;
                course.Lessons.forEach(lesson => {
                  if (lesson.LessonUsers[0].isfinished) {
                    completeLesson += 1;
                  }
                });
                UserEnrollment.findOne({
                  where: {
                    CourseId: course.id,
                    UserId: req.user.id
                  }
                }).then(enrollment => {
                  let completeRate = 0;
                  completeRate += Math.round(
                    (completeLesson / course.Lessons.length) * 100
                  );
                  enrollment.update({
                    finishLessonCount: completeLesson,
                    completeRate: completeRate
                  });
                });
              });
            });
        } else {
          LessonUser.create({
            isfinished: true,
            finishedDate: new Date(),
            LessonId: parseInt(req.params.lesson_id),
            UserId: req.user.id
          }).then(user => {
            // 更新completeRate
            Course.findByPk(req.params.course_id, {
              include: [{ model: Lesson, attribute: ["id"] }]
            }).then(course => {
              console.log(course.Lessons);
            });
            res.redirect("back");
          });
        }
      });
    }
  },
  // 使用者可以看到收藏的課程
  getFavoriteCourses: (req, res) => {
    let userEnrolledId = [];
    if (req.user) {
      req.user.UserEnrollments.forEach(enroll => {
        userEnrolledId.push(enroll.CourseId);
      });
    }
    Favorite.findAll({
      where: { UserId: req.user.id },
      include: [Course]
    }).then(favorites => {
      // 辨認課程是否被登入的使用者購買
      const data = favorites.map(c => ({
        ...c.dataValues,
        enrolled: userEnrolledId.includes(c.dataValues.CourseId)
      }));
      return res.render("favoriteCourses", { favorites: data });
    });
  },
  // 獲取電子報
  getNewsLetter: (req, res) => {
    req.flash('success_messages', '感謝你註冊電子報，我們將陸續為你提供課程優惠資訊及相關活動')
    return res.redirect('back')
  }
};

module.exports = userController;
