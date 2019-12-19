const db = require("../models");
const Course = db.Course;
const CourseCategory = db.CourseCategory;
const User = db.User;
const UserEnrollment = db.UserEnrollment;
const Lesson = db.Lesson;

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
  },
  // 未登入者及已登入者都可連結 intro 頁面
  createCourseIntro: (req, res) => {
    //<<<<<<<測試階段，先建立假的 user(待建立登入路由後，即可移除下面程式碼)
    req.user = {};
    //>>>>>>>>

    // 先判斷使用者是否登入，再判斷使用者之前是否曾編輯過課程(status:editted)
    if (req.user) {
      Course.findOne({
        where: {
          UserId: req.user.id,
          status: "editted"
        }
      }).then(course => {
        if (course) {
          return res.redirect("/users/:id/teachCourses");
        } else {
          //<<<<<<<測試階段，先建立假的 user(待建立登入路由後，即可移除下面程式碼)
          req.user = { id: 1 };
          //>>>>>>>>

          Course.create({
            status: "editted",
            UserId: req.user.id
          }).then(course => {
            return res.render("createCourseIntro", { course });
          });
        }
      });
    } else {
      return res.redirect("/signin");
    }
  },
  // 建立課程 Sep1 頁面(登入者才可以連結至此頁面)
  createCourseStep1: (req, res) => {
    //<<<<<<<測試階段，先建立假的 user(待建立登入路由後，即可移除下面程式碼)
    req.user = { id: 1 };
    //>>>>>>>>

    // 找出該 user 未編輯完成的course
    Course.findOne({
      where: {
        UserId: req.user.id,
        id: req.params.courseId,
        status: "editted"
      }
    }).then(course => {
      return res.render("createCourseStep1", { course });
    });
  },
  // 送出建立課程 step 1 的資料
  putCourseStep1: (req, res) => {
    //<<<<<<<測試階段，先建立假的 user(待建立登入路由後，即可移除下面程式碼)
    req.user = { id: 1 };
    //>>>>>>>>

    Course.findByPk(req.params.courseId).then(course => {
      course
        .update({
          name: req.body.name,
          description: req.body.description,
          teacherDescrip: req.body.teacherDescrip,
          teacherName: req.body.teacherName
        })
        .then(courseSaved => {
          return res.redirect("back");
        });
    });
  },
  // 建立課程 Sep2 頁面(登入者才可以連結至此頁面)
  createCourseStep2: (req, res) => {
    //<<<<<<<測試階段，先建立假的 user(待建立登入路由後，即可移除下面程式碼)
    req.user = { id: 1 };
    //>>>>>>>>

    Lesson.findAll({
      where: {
        CourseId: req.params.courseId
      }
    }).then(lessons => {
      Course.findByPk(req.params.courseId).then(course => {
        return res.render("createCourseStep2", { course, lessons });
      });
    });
  },
  editCourseStep2: (req, res) => {
    //<<<<<<<測試階段，先建立假的 user(待建立登入路由後，即可移除下面程式碼)
    req.user = { id: 1 };
    //>>>>>>>>

    Lesson.findAll({
      where: {
        CourseId: req.params.courseId
      }
    }).then(lessons => {
      Course.findByPk(req.params.courseId).then(course => {
        Lesson.findOne({
          where: {
            id: req.params.lessonId,
            CourseId: req.params.courseId
          }
        }).then(lesson => {
          return res.render("createCourseStep2", { course, lessons, lesson });
        });
      });
    });
  },
  postCourseStep2: (req, res) => {
    const {
      lessonNumber,
      intro,
      title,
      contents,
      totalTime,
      isPreview
    } = req.body;
    // 檢查必填欄位是否已填寫(若有提供暫存草稿機制，則不用檢查欄位。直到送出申請前再檢查)
    if (
      !lessonNumber ||
      !intro ||
      !title ||
      !contents ||
      !totalTime ||
      !isPreview
    ) {
      req.flash("error_messages", "有些欄位忘記填寫喔~");
      return res.redirect("back");
    }

    Lesson.create({
      lessonNumber: parseInt(req.body.lessonNumber) || null,
      intro: req.body.intro || null,
      title: req.body.title || null,
      contents: req.body.contents || null,
      image: req.body.image || null,
      totalTime: parseInt(req.body.totalTime) || null,
      isPreview: req.body.isPreview == "true" ? true : false,
      visible: req.body.visible || true,
      CourseId: req.params.courseId
    }).then(lesson => {
      Lesson.findAll({
        where: {
          CourseId: req.params.courseId
        }
      }).then(lessons => {
        Course.findByPk(req.params.courseId).then(course => {
          course.totalLessons = lessons.length;
          // 初始化 totalTime 為 0
          course.totalTime = 0;
          // 計算 course.totalTime
          lessons.forEach(r => {
            course.totalTime += r.totalTime;
          });

          course.save().then(course => {
            return res.redirect("back");
          });
        });
      });
    });
  },
  // 送出建立課程 step 2 的資料
  putCourseStep2: (req, res) => {
    const {
      lessonNumber,
      intro,
      title,
      contents,
      totalTime,
      isPreview
    } = req.body;
    // 檢查必填欄位是否已填寫(若有提供暫存草稿機制，則不用檢查欄位。直到送出申請前再檢查)
    if (
      !lessonNumber ||
      !intro ||
      !title ||
      !contents ||
      !totalTime ||
      !isPreview
    ) {
      req.flash("error_messages", "有些欄位忘記填寫喔~");
      return res.redirect("back");
    }

    Lesson.findByPk(req.params.lessonId).then(lesson => {
      lesson
        .update({
          id: req.params.lessonId,
          lessonNumber: parseInt(req.body.lessonNumber) || null,
          intro: req.body.intro || null,
          title: req.body.title || null,
          contents: req.body.contents || null,
          image: req.body.image || null,
          totalTime: parseInt(req.body.totalTime) || null,
          isPreview: req.body.isPreview == "true" ? true : false,
          visible: req.body.visible || true,
          CourseId: req.params.courseId
        })
        .then(lesson => {
          Lesson.findAll({
            where: {
              CourseId: req.params.courseId
            }
          }).then(lessons => {
            Course.findByPk(req.params.courseId).then(course => {
              course.totalLessons = lessons.lenghth;
              // 初始化 totalTime 為 0
              course.totalTime = 0;
              // 計算 course.totalTime
              lessons.forEach(r => {
                course.totalTime += r.totalTime;
              });

              course.save().then(course => {
                return res.render("createCourseStep2", {
                  lessons,
                  course,
                  lesson
                });
              });
            });
          });
        });
    });
  },
  createCourseStep3: (req, res) => {
    Course.findByPk(req.params.courseId, { include: [Lesson] }).then(course => {
      return res.render("createCourseStep3", { course });
    });
  },
  putCourseStep3: (req, res) => {
    if (!req.body.price) {
      req.flash("error_messages", "沒有填寫金額！");
      return res.redirect("back");
    }
    Course.findByPk(req.params.courseId).then(course => {
      course.price = parseInt(req.body.price);
      course.save().then(course => {
        return res.redirect("back");
        return res.render("createCourseStep3", { course });
      });
    });
  },
  createCourseStep4: (req, res) => {
    Course.findByPk(req.params.courseId).then(course => {
      return res.render("createCourseStep4", { course });
    });
  },
  postCourseStep4: (req, res) => {
    //<<<<<<<測試階段，先建立假的 user(待建立登入路由後，即可移除下面程式碼)
    req.user = { id: 1 };
    //>>>>>>>>

    // 先檢查所有 step 是否皆已完成，若未完成，則導向該 step
    Course.findByPk(req.params.courseId, {
      include: [Lesson]
    }).then(course => {
      const {
        name,
        description,
        introVideo,
        teacherName,
        teacherDescrip,
        totalTime,
        totalLessons,
        price
      } = course;

      if (
        course.Lessons.length == 0 ||
        name == null ||
        description == null ||
        teacherDescrip == null ||
        totalTime == null ||
        totalLessons == null ||
        price == null
      ) {
        return res.redirect(`/courses/create/${req.params.courseId}/step1`);
      } else {
        // 若所有 step 皆已完成，則送出申請
        Course.findByPk(req.params.courseId).then(course => {
          course
            .update({
              status: "submitted",
              submittedDate: new Date()
            })
            .then(course => {
              return res.redirect(`/users/${req.user.id}/teachCourses`);
            });
        });
      }
    });
  }
};

module.exports = courseController;
