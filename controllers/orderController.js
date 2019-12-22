const db = require("../models");
const Course = db.Course;
const UserEnrollment = db.UserEnrollment;

const orderController = {
  orderCourse: (req, res) => {
    Course.findByPk(req.params.courses_id).then(course => {
      let today = new Date();
      if (course) {
        UserEnrollment.create({
          timeStart: today,
          CourseId: course.id,
          UserId: req.user.id
        }).then(user => {
          req.flash("success_messages", `感謝您購買${course.name}課程`);
          res.redirect("back");
        });
      } else {
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
    });
  }
};

module.exports = orderController;
