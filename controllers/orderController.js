const db = require("../models");
const Course = db.Course;
const UserEnrollment = db.UserEnrollment;

const orderController = {
  orderCourse: (req, res) => {
    Course.findByPk(req.params.courses_id).then(course => {
      let today = new Date();
      if (course) {
        // 判別使用者是否買過該課程
        UserEnrollment.findOne({
          where: {
            CourseId: course.id,
            UserId: req.user.id
          }
        }).then(enrollment => {
          // 使用者已購買該課程
          if (enrollment) {
            req.flash("error_messages", "您已買過該課程！");
            res.redirect("back");
            // 使用者未購買該課程
          } else {
            // course model的studentCount要加1
            Course.increment("studentCount", {
              where: { id: req.params.courses_id }
            });
            // 建立User Enrollment資料
            UserEnrollment.create({
              timeStart: today,
              CourseId: course.id,
              UserId: req.user.id
            }).then(user => {
              req.flash("success_messages", `感謝您購買${course.name}課程`);
              res.redirect("back");
            });
          }
        });
      } else {
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
    });
  }
};

module.exports = orderController;
