const db = require("../models");
const Course = db.Course
const User = db.User
const UserEnrollment = db.UserEnrollment
const Lesson = db.Lesson


const userController = {

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
          model: db.UserEnrollment, include: [{
            model: db.User,
          }]
        },
      ]
    })
      .then(courses => {
        return res.json(courses)
      })
  },
}

module.exports = userController
