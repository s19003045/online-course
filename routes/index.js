const userController = require("../controllers/userController");
const courseController = require("../controllers/courseController");
const adminController = require("../controllers/adminController");
const assignController = require("../controllers/assignController");
const questController = require("../controllers/questController");
const orderController = require("../controllers/orderController");
const cartController = require("../controllers/cartController");
const instructController = require("../controllers/instructController");


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
  app.get("/", authenticated, (req, res) => res.redirect("/courses"));

  app.get("/courses", authenticated, courseController.getCourses);


  // 開課者建立課程
  app.get("/courses/create/intro", authenticated, courseController.createCourseIntro);
  app.get(
    "/courses/create/:courseId/step1", authenticated,
    courseController.createCourseStep1
  );
  app.put("/courses/create/:courseId/step1", authenticated, courseController.putCourseStep1);
  app.get(
    "/courses/create/:courseId/step2", authenticated,
    courseController.createCourseStep2
  );
  app.post("/courses/create/:courseId/step2", authenticated, courseController.postCourseStep2);
  app.get(
    "/courses/create/:courseId/step2/:lessonId/edit", authenticated,
    courseController.editCourseStep2
  );
  app.put(
    "/courses/create/:courseId/step2/:lessonId", authenticated,
    courseController.putCourseStep2
  );
  app.get(
    "/courses/create/:courseId/step3", authenticated,
    courseController.createCourseStep3
  );
  app.put("/courses/create/:courseId/step3", authenticated, courseController.putCourseStep3);
  app.get(
    "/courses/create/:courseId/step4", authenticated,
    courseController.createCourseStep4
  );
  app.post("/courses/create/:courseId/step4", authenticated, courseController.postCourseStep4);

  //開課者dashboard
  app.get('/instructor/dashboard', authenticated, instructController.getDashboard)
  app.get('/instructor/courses', authenticated, instructController.getCourses)
  app.get('/instructor/students', authenticated, instructController.getStudents)
  app.get('/instructor/course-review-discuss', authenticated, instructController.courseReviwDiscuss)
  // app.get('/instructor/course/:courseId/', instructController.saleAnalysis)
  // app.get('/instructor/course/:courseId', instructController.studentAnalysis)

  // 導向 intructor/dashboard
  app.get('/instructor/*', (req, res) => res.redirect("/instructor/dashboard"))


  // 開課者可以查詢課程狀態、學生人數等
  app.get("/users/:id/teachCourses", authenticated, userController.getTeachCourses);
  app.post("/favorite/:courses_id", authenticated, userController.addFavoriteCourse);

  // 導向首頁
  app.get('/*', (req, res) => res.redirect("/"))
};

