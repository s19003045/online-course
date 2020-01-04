const db = require("../models");
const Course = db.Course;
const User = db.User;
const UserEnrollment = db.UserEnrollment;
const Lesson = db.Lesson;
const LessonUser = db.LessonUser;
const CourseCategory = db.CourseCategory;
const CourseSubCategory = db.CourseSubCategory;
const SortCourses = require("../public/js/sort_courses");

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
    order = SortCourses(req.query.order);
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
    });
  },
  // 依主類別篩選課程
  getMainCategoryCourse: (req, res) => {
    // 取得sort功能要依據哪個變數排序所有課程
    order = SortCourses(req.query.order);
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
        });
      }
    });
  },
  // 依次類別篩選課程
  getSubCategoryCourse: (req, res) => {
    // 取得sort功能要依據哪個變數排序所有課程
    order = SortCourses(req.query.order);
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
            });
          }
        });
      }
    });
  },
  // 未登入者及已登入者都可連結 intro 頁面
  createCourseIntro: (req, res) => {
    // 先判斷使用者是否登入，若已登入則建立新的課程 id
    if (req.user) {
      Course.create({
        status: "editted",
        UserId: req.user.id
      }).then(course => {
        return res.render("createCourse/createCourseIntro", { course });
      });
    } else {
      return res.redirect("/signin");
    }
  },
  // 建立課程 Sep1 頁面(登入者才可以連結至此頁面)
  createCourseStep1: (req, res) => {
    // 找出該 user 未編輯完成的course
    Course.findOne({
      where: {
        UserId: req.user.id,
        id: req.params.courseId,
        status: "editted"
      }
    }).then(course => {
      CourseSubCategory.findAll({
        include: [CourseCategory]
      }).then(courseSubCategories => {
        return res.render("createCourse/createCourseStep1", {
          course,
          courseSubCategories
        });
      });
    });
  },
  // 送出建立課程 step 1 的資料
  putCourseStep1: (req, res) => {
    Course.findByPk(req.params.courseId).then(course => {
      CourseSubCategory.findByPk(req.body.CourseSubCategoryId).then(
        subCategory => {
          console.log(subCategory);
          course
            .update({
              name: req.body.name,
              description: req.body.description,
              teacherDescrip: req.body.teacherDescrip,
              teacherName: req.body.teacherName,
              CourseCategoryId: subCategory.CourseCategoryId,
              CourseSubCategoryId: parseInt(req.body.CourseSubCategoryId)
            })
            .then(course => {
              return res.redirect(`/courses/create/${course.id}/step1`);
            });
        }
      );
    });
  },
  // 建立課程 Sep2 頁面(登入者才可以連結至此頁面)
  createCourseStep2: (req, res) => {
    Lesson.findAll({
      where: {
        CourseId: req.params.courseId
      }
    }).then(lessons => {
      // 排序：依 lessonNumber，由小到大
      lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
      Course.findByPk(req.params.courseId).then(course => {
        return res.render("createCourse/createCourseStep2", {
          course,
          lessons
        });
      });
    });
  },
  editCourseStep2: (req, res) => {
    Lesson.findAll({
      where: {
        CourseId: req.params.courseId
      }
    }).then(lessons => {
      // 排序：依 lessonNumber，由小到大
      lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);

      Course.findByPk(req.params.courseId).then(course => {
        Lesson.findOne({
          where: {
            id: req.params.lessonId,
            CourseId: req.params.courseId
          }
        }).then(lesson => {
          return res.render("createCourse/createCourseStep2", {
            course,
            lessons,
            lesson
          });
        });
      });
    });
  },
  editLessonNumber: (req, res) => {
    if (!req.body.lessonNumber) {
      console.log("lessonNumber undefined");
    } else {
      Lesson.findOne({
        where: {
          id: parseInt(req.body.pk)
        }
      }).then(lesson => {
        lesson
          .update({
            lessonNumber: parseInt(req.body.lessonNumber)
          })
          .then(lesson => {
            console.log("change lesson id:", lesson.id);
            return res.status(200).send("OK");
          });
      });
    }
  },
  deleteCourseStep2: (req, res) => {
    Lesson.findOne({ where: { id: req.params.lessonId } }).then(lesson => {
      lesson.destroy();
      return res.status(200);
    });
  },
  createLessonTitle: (req, res) => {
    Lesson.create({
      lessonNumber: parseInt(req.body.lessonNumber),
      title: req.body.title,
      CourseId: parseInt(req.params.courseId)
    }).then(lesson => {
      return res.redirect(`/courses/create/${req.params.courseId}/step2`);
    });
  },
  postCourseStep2: (req, res) => {
    const {
      lessonNumber,
      intro,
      title,
      contents,
      videoURL,
      totalTime,
      isPreview
    } = req.body;
    // 檢查必填欄位是否已填寫(若有提供暫存草稿機制，則不用檢查欄位。直到送出申請前再檢查)
    if (
      !lessonNumber ||
      !intro ||
      !title ||
      !contents ||
      !videoURL ||
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
      videoURL: req.body.videoURL || null,
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
                return res.render("createCourse/createCourseStep2", {
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
      return res.render("createCourse/createCourseStep3", { course });
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
        return res.render("createCourse/createCourseStep3", { course });
      });
    });
  },
  createCourseStep4: (req, res) => {
    Course.findByPk(req.params.courseId).then(course => {
      return res.render("createCourse/createCourseStep4", { course });
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
        price,
        CourseCategoryId,
        CourseSubCategoryId
      } = course;

      // 若課程名稱、課程簡介、講師姓名、講師介紹為填寫完，則導回 step1
      if (
        name == null ||
        description == null ||
        teacherDescrip == null ||
        teacherName == null ||
        CourseCategoryId == null ||
        CourseSubCategoryId == null
      ) {
        return res.redirect(`/courses/create/${req.params.courseId}/step1`);
      } else if (
        // 若簡介影片、未編輯 lesson，則導回 step2
        introVideo == null ||
        course.Lessons.length == 0
      ) {
        return res.redirect(`/courses/create/${req.params.courseId}/step2`);
      } else if (
        // 若未設定售價，則導回 step3
        price == null
      ) {
        return res.redirect(`/courses/create/${req.params.courseId}/step3`);
      } else {
        // 若所有 step 皆已完成，則送出申請
        Course.findByPk(req.params.courseId).then(course => {
          course
            .update({
              status: "submitted",
              submittedDate: new Date()
            })
            .then(course => {
              return res.redirect(`/instructor/courses`);
            });
        });
      }
    });
  }
};

module.exports = courseController;
