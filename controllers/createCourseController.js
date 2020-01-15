const db = require("../models");
const Course = db.Course;
const User = db.User;
const UserEnrollment = db.UserEnrollment;
const Lesson = db.Lesson;
const LessonUser = db.LessonUser;
const CourseCategory = db.CourseCategory;
const CourseSubCategory = db.CourseSubCategory;
const DiscussPost = db.DiscussPost;
const DiscussReply = db.DiscussReply;
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const helpers = require("../_helpers");

const createCourseController = {
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
        id: req.params.courseId
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
  postCourseStep1: (req, res) => {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.CourseSubCategoryId ||
      !req.body.teacherDescrip ||
      !req.body.teacherName ||
      !req.body.introVideo
    ) {
      req.flash("error_messages", "所有欄位都是必填");
      return res.redirect("back");
    }

    const { file } = req;

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);

      return imgur.upload(file.path, (err, img) => {
        if (err) {
          console.log(err);
        } else {
          imgLink = img.data ? img.data.link : "";
          return Course.findByPk(req.params.courseId).then(course => {
            CourseSubCategory.findByPk(req.body.CourseSubCategoryId).then(
              subCategory => {
                console.log(subCategory);
                course
                  .update({
                    name: req.body.name || course.name,
                    description: req.body.description || course.description,
                    introVideo: req.body.introVideo || course.introVideo,
                    teacherDescrip:
                      req.body.teacherDescrip || course.teacherDescrip,
                    teacherName: req.body.teacherName || course.teacherName,
                    CourseCategoryId: subCategory.CourseCategoryId,
                    CourseSubCategoryId: parseInt(req.body.CourseSubCategoryId),
                    image: imgLink
                  })
                  .then(course => {
                    CourseSubCategory.findAll({
                      include: [CourseCategory]
                    }).then(courseSubCategories => {
                      return res.render("createCourse/createCourseStep1", {
                        course,
                        courseSubCategories
                      });
                    });
                  });
              }
            );
          });
        }
      });
    } else {
      return Course.findByPk(req.params.courseId).then(course => {
        CourseSubCategory.findByPk(req.body.CourseSubCategoryId).then(
          subCategory => {
            console.log(subCategory);
            course
              .update({
                name: req.body.name || course.name,
                description: req.body.description || course.description,
                introVideo: req.body.introVideo || course.introVideo,
                teacherDescrip:
                  req.body.teacherDescrip || course.teacherDescrip,
                teacherName: req.body.teacherName || course.teacherName,
                CourseCategoryId: subCategory.CourseCategoryId,
                CourseSubCategoryId: parseInt(req.body.CourseSubCategoryId)
              })
              .then(course => {
                CourseSubCategory.findAll({
                  include: [CourseCategory]
                }).then(courseSubCategories => {
                  return res.render("createCourse/createCourseStep1", {
                    course,
                    courseSubCategories
                  });
                });
              });
          }
        );
      });
    }
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
      CourseId: parseInt(req.params.courseId),
      isPreview: false, //是否提供預覽
      visible: true, //是否要顯示
    })
      .then(lesson => {
        return res.redirect(`/courses/create/${req.params.courseId}/step2`)
      })
  },
  postCourseStep2: (req, res) => {
    const {
      lessonNumber,
      intro,
      title,
      contents,
      videoURL,
      totalTime,
      isPreview,
      visible
    } = req.body;
    // 檢查必填欄位是否已填寫(若有提供暫存草稿機制，則不用檢查欄位。直到送出申請前再檢查)
    if (
      !lessonNumber ||
      !intro ||
      !title ||
      !contents ||
      !videoURL ||
      !totalTime ||
      !isPreview ||
      !visible
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
      videoURL,
      totalTime,
      isPreview,
      visible
    } = req.body;
    // 檢查必填欄位是否已填寫(若有提供暫存草稿機制，則不用檢查欄位。直到送出申請前再檢查)
    if (
      !lessonNumber ||
      !intro ||
      !title ||
      !contents ||
      !videoURL ||
      !totalTime ||
      !isPreview ||
      !visible
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
          videoURL: req.body.videoURL || null,
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
              course.totalLessons = lessons.length;
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
      });
    });
  },
  createCourseStep4Intro: (req, res) => {
    Course.findByPk(req.params.courseId, { include: User }).then(course => {
      return res.render("createCourse/createCourseStep4-intro", { course });
    });
  },
  createCourseStep4Lessons: (req, res) => {
    let lessonNumber = 1;
    if (req.query.lessonNumber) {
      lessonNumber = Number(req.query.lessonNumber);
    }
    Course.findByPk(req.params.courseId).then(course => {
      if (course) {
        Lesson.findAll({
          attributes: ["lessonNumber", "title"],
          where: [{ visible: true }, { CourseId: course.id }]
        }).then(lessons => {
          console.log(lessons)
          Lesson.findOne({
            where: {
              lessonNumber: lessonNumber,
              CourseId: course.id
            }
          }).then(lesson => {
            res.render("createCourse/createCourseStep4-lessons", {
              course,
              lesson,
              lessons,
              lessonNumber
            });
          });
        });
      } else {
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
    });
  },
  createCourseStep4Post: (req, res) => {
    Course.findByPk(req.params.courseId).then(course => {
      if (course) {
        DiscussPost.findAll({
          include: [
            User,
            {
              model: DiscussReply,
              include: [User]
            }
          ],
          where: [{ CourseId: course.id }],
          order: [["createdAt", "DESC"]]
        }).then(posts => {
          return res.render("createCourse/createCourseStep4-post", {
            course,
            posts,
            postsLength: posts.length,
            courseId: course.id,
            courseName: course.name
          });
        });
      } else {
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
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
              status: "intoMarket",
              submittedDate: new Date(),
              intoMarketDate: new Date()
            })
            .then(course => {
              return res.redirect(`/instructor/courses`);
            });
        });
      }
    });
  }
};

module.exports = createCourseController;
