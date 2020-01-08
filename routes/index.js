const userController = require("../controllers/userController");
const courseController = require("../controllers/courseController");
const adminController = require("../controllers/adminController");
const assignController = require("../controllers/assignController");
const postController = require("../controllers/postController");
const orderController = require("../controllers/orderController");
const cartController = require("../controllers/cartController");
const instructController = require("../controllers/instructController");
const createCourseController = require("../controllers/createCourseController");

const multer = require("multer");
const upload = multer({ dest: "temp/" });

// helpers 用來取代 req.user 成 helpers.getUser(req) & 取代 req.isAuthenticated() 成 helpers.ensureAuthenticated(req)
const helpers = require("../_helpers");

module.exports = (app, passport) => {
  // 驗證使用者權限
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
    res.redirect("/signin");
  };
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === "admin") {
        return next();
      }
      return res.redirect("/");
    }
    res.redirect("/signin");
  };
  // 註冊/登入/登出
  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);

  app.get("/signin", userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true
    }),
    userController.signIn
  );
  app.get("/logout", userController.logout);

  //如果使用者訪問首頁，就導向 /courses 的頁面
  app.get("/", (req, res) => {
    res.redirect("/courses");
  });
  // 看全部課程
  app.get("/courses", courseController.getCourses);
  // 看單一課程介紹
  app.get("/courses/:courses_id/introduction", courseController.getCourseIntro);

  // 使用者可以看單一課程的單元內容
  app.get(
    "/courses/:courses_id/lessons",
    authenticated,
    courseController.getCourseLesson
  );

  // 使用者可以在課程內容頁面勾選complete checkbox標註已完成的單元
  app.post(
    "/courses/:courses_id/lessons/:lesson_id",
    authenticated,
    userController.postFinishLesson
  );

  // 使用者登入後可以看到問題討論區
  app.get(
    "/courses/:courses_id/post",
    authenticated,
    postController.getCoursePost
  );

  // 使用者登入後可以針對課程發表問題
  app.post(
    "/courses/:course_id/post",
    authenticated,
    postController.postDiscussPost
  );

  // 使用者登入後可以回覆課程問題
  app.post(
    "/courses/:course_id/post/:post_id/reply",
    authenticated,
    postController.postDiscussReply
  );

  // 使用者登入後可以看到已購買的課程
  app.get(
    "/users/boughtCourses",
    authenticated,
    userController.getBoughtCourses
  );

  // 開課者建立課程
  app.get(
    "/courses/create/intro",
    authenticated,
    createCourseController.createCourseIntro
  );
  app.get(
    "/courses/create/:courseId/step1",
    authenticated,
    createCourseController.createCourseStep1
  );
  app.post(
    "/courses/create/:courseId/step1",
    authenticated, upload.single('image'),
    createCourseController.postCourseStep1
  );
  app.get(
    "/courses/create/:courseId/step2",
    authenticated,
    createCourseController.createCourseStep2
  );
  app.post(
    "/courses/create/:courseId/step2",
    authenticated,
    createCourseController.postCourseStep2
  );
  app.post(
    "/courses/create/:courseId/step2/createLessonTitle",
    authenticated,
    createCourseController.createLessonTitle
  );
  app.get(
    "/courses/create/:courseId/step2/:lessonId/edit",
    authenticated,
    createCourseController.editCourseStep2
  );
  // 刪除該lesson(disable 該lesson)
  app.delete(
    "/courses/create/:courseId/step2/:lessonId",
    authenticated,
    createCourseController.deleteCourseStep2
  );
  // 異動 lesson 的 lessonNumber
  app.put(
    "/courses/create/:courseId/step2/editLessonNumber",
    authenticated,
    createCourseController.editLessonNumber
  );
  // 修改 lesson 內容
  app.put(
    "/courses/create/:courseId/step2/:lessonId",
    authenticated,
    createCourseController.putCourseStep2
  );

  app.get(
    "/courses/create/:courseId/step3",
    authenticated,
    createCourseController.createCourseStep3
  );
  app.put(
    "/courses/create/:courseId/step3",
    authenticated,
    createCourseController.putCourseStep3
  );
  app.get(
    "/courses/create/:courseId/step4/intro",
    authenticated,
    createCourseController.createCourseStep4Intro
  );
  app.get(
    "/courses/create/:courseId/step4/lessons",
    authenticated,
    createCourseController.createCourseStep4Lessons
  );
  app.get(
    "/courses/create/:courseId/step4/post",
    authenticated,
    createCourseController.createCourseStep4Post
  );
  app.post(
    "/courses/create/:courseId/step4",
    authenticated,
    createCourseController.postCourseStep4
  );

  //開課者dashboard
  app.get(
    "/instructor/dashboard",
    authenticated,
    instructController.getDashboard
  );
  //於開課者dashboard 瀏灠所有課程
  app.get("/instructor/courses", authenticated, instructController.getCourses);
  //於開課者dashboard 瀏灠所有課程的學生
  app.get(
    "/instructor/students",
    authenticated,
    instructController.getStudents
  );
  //於開課者dashboard 的課程審核討論區
  app.get(
    "/instructor/course-review-discuss",
    authenticated,
    instructController.courseReviwDiscuss
  );
  // 留言於課程審核討論區
  app.post(
    "/instructor/course-review-discuss/post",
    authenticated,
    instructController.leaveCourRevPost
  );
  // 回應於課程審核討論區
  app.post(
    "/instructor/course-review-discuss/reply",
    authenticated,
    instructController.leaveCourRevReply
  );
  // app.get('/instructor/course/:courseId/', instructController.saleAnalysis)
  // app.get('/instructor/course/:courseId', instructController.studentAnalysis)

  //使用者可以看個人帳號資訊
  app.get("/users/account", authenticated, userController.getUser);

  //使用者可以看到收藏的課程清單
  app.get(
    "/users/favoriteCourses",
    authenticated,
    userController.getFavoriteCourses
  );

  // 開課者可以查詢課程狀態、學生人數等
  app.get(
    "/users/:id/teachCourses",
    authenticated,
    userController.getTeachCourses
  );
  // 使用者可以收藏課程
  app.post(
    "/favorite/:courses_id",
    authenticated,
    userController.addFavoriteCourse
  );
  // 使用可以購買課程
  app.post("/order/:courses_id", authenticated, orderController.orderCourse);

  // 用主類別篩選課程
  app.get("/courses/:mainCategoName", courseController.getMainCategoryCourse);
  // 用次類別篩選課程
  app.get(
    "/courses/:mainCategoName/:subCategoName",
    courseController.getSubCategoryCourse
  );

  //admin dashboard
  app.get(
    "/admin/dashboard",
    authenticated,
    authenticatedAdmin,
    adminController.getDashboard
  );
  //於admin dashboard 瀏灠所有課程
  app.get(
    "/admin/dashboard/courses",
    authenticated,
    authenticatedAdmin,
    adminController.getCourses
  );
  //於admin dashboard 瀏灠所有課程的學生
  app.get(
    "/admin/dashboard/students",
    authenticated,
    authenticatedAdmin,
    adminController.getStudents
  );
  //於admin dashboard 的課程審核討論區
  app.get(
    "/admin/dashboard/course-review-discuss",
    authenticated,
    authenticatedAdmin,
    adminController.courseReviwDiscuss
  );
  // 留言於課程審核討論區
  app.post(
    "/admin/dashboard/course-review-discuss/post",
    authenticated,
    authenticatedAdmin,
    adminController.leaveCourRevPost
  );
  // 回應於課程審核討論區
  app.post(
    "/admin/dashboard/course-review-discuss/reply",
    authenticated,
    authenticatedAdmin,
    adminController.leaveCourRevReply
  );
};
