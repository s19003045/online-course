const db = require("../models");
const Course = db.Course
const User = db.User
const UserEnrollment = db.UserEnrollment
const Lesson = db.Lesson
const CourseReviewPost = db.CourseReviewPost
const CourseReviewReply = db.CourseReviewReply


const Sequelize = require('sequelize')
const Op = Sequelize.Op

const instructController = {
  getDashboard: (req, res) => {
    return res.render('instructor/dashboard')
  },
  getCourses: (req, res) => {
    // 定義 Model query 中的 where option
    const whereOption = req.query.filter_status ? [{ status: req.query.filter_status }] : [{
      status: {
        [Op.eq]: 'editted'
      }
    }, {
      status: {
        [Op.eq]: 'submitted'
      }
    }, {
      status: {
        [Op.eq]: 'intoMarket'
      }
    }, {
      status: {
        [Op.eq]: 'offMarket'
      }
    }]
    // filter_status 用於 handlebars
    let filter_status = req.query.filter_status ? req.query.filter_status : 'all'

    // 定義 Model query 中的 order option
    const orderOption = req.query.sortby ? [`${req.query.sortby}`, 'DESC'] : ['status', 'DESC']
    // sortby 用於 handlebars
    let sortby = req.query.sortby ? req.query.sortby : ''

    // 帶入 whereOption 及 orderOption
    Course.findAll({
      where: {
        UserId: req.user.id,
        [Op.or]: whereOption
      },
      order: [orderOption]
    })
      .then(courses => {
        return res.render('instructor/instructCourses', { courses, filter_status, sortby })
      })
  },
  getStudents: (req, res) => {
    // 定義 Model query 中的 where option
    const whereOption = req.query.filter_status ? [{ status: req.query.filter_status }] : [{
      status: {
        [Op.eq]: 'editted'
      }
    }, {
      status: {
        [Op.eq]: 'submitted'
      }
    }, {
      status: {
        [Op.eq]: 'intoMarket'
      }
    }, {
      status: {
        [Op.eq]: 'offMarket'
      }
    }]
    // filter_status 用於 handlebars
    let filter_status = req.query.filter_status ? req.query.filter_status : 'all'

    // 定義 Model query 中的 order option
    const orderOption = req.query.sortby ? [`${req.query.sortby}`, 'DESC'] : ['status', 'DESC']
    // sortby 用於 handlebars
    let sortby = req.query.sortby ? req.query.sortby : ''

    Course.findAll({
      where: {
        UserId: req.user.id,
        [Op.or]: whereOption
      },
      order: [orderOption],
      attributes: ['id', 'name', 'image', 'studentCount'],
      include: [{
        model: UserEnrollment,
        attributes: ['finishLessonCount', 'completeRate', 'UserId', 'CourseId'],
        include: [{
          model: User,
          attributes: ['username', 'email', 'avatar']
        }]
      }]
    })
      .then(courses => {
        // return res.json(courses)
        return res.render('instructor/instructStudents', { courses, filter_status, sortby })
      })
  },
  // dashboard 的課程審核討論區
  courseReviwDiscuss: async (req, res) => {
    console.log('courseId:', req.query.courseId)
    // filter_status 用於 handlebars
    req.query.courseId = req.query.courseId == undefined ? 'all' : req.query.courseId

    // 篩選課程清單
    const coursesForSelectOption = await Course.findAll({
      where: { UserId: req.user.id },
      attributes: ['id', 'name']
    })

    // 篩選所有課程的所有審核課程討論
    if (req.query.courseId === 'all') {
      const coursesFiltered = await Course.findAll({
        where: {
          UserId: req.user.id
        },
        attributes: ['id', 'name', 'image', 'status', 'CourseCategoryId', 'UserId', 'createdAt', 'updatedAt'],
        include: [
          {
            model: User,
            attributes: ['username', 'avatar', 'role']
          },
          {
            model: CourseReviewPost,
            include: [
              {
                model: User,
                attributes: ['username', 'avatar', 'role']
              },
              {
                model: CourseReviewReply,
                include: [
                  {
                    model: User,
                    attributes: ['username', 'avatar', 'role']
                  },
                ],
                order: ['createdAt', 'DESC']
              }
            ],
            order: ['createdAt', 'DESC']
          }]
      })
      let courseNameFiltered = '所有課程'

      return res.render('instructor/courseReviewDiscuss', { courses: coursesFiltered, user: req.user, courseId: req.query.courseId, coursesForSelectOption, courseNameFiltered: courseNameFiltered })
    } else {
      // 篩選單一課程的審核討論
      const coursesFiltered = await Course.findAll({
        where: {
          UserId: req.user.id,
          id: req.query.courseId
        },
        attributes: ['id', 'name', 'image', 'status', 'CourseCategoryId', 'UserId', 'createdAt', 'updatedAt'],
        include: [
          {
            model: User,
            attributes: ['username', 'avatar', 'role']
          },
          {
            model: CourseReviewPost,
            include: [
              {
                model: User,
                attributes: ['username', 'avatar', 'role']
              },
              {
                model: CourseReviewReply,
                include: [
                  {
                    model: User,
                    attributes: ['username', 'avatar', 'role']
                  },
                ],
                order: ['createdAt', 'DESC']
              }
            ],
            order: ['createdAt', 'DESC']
          }]
      })
      // return res.json(coursesFiltered)
      let courseNameFiltered = coursesFiltered[0].name
      // return res.json(coursesFiltered)
      return res.render('instructor/courseReviewDiscuss', { courses: coursesFiltered, user: req.user, courseId: req.query.courseId, coursesForSelectOption, courseNameFiltered: courseNameFiltered })
    }

  },
  // 留言於課程審核討論區
  leaveCourRevPost: (req, res) => {
    // 先找出該使用者所有開立的課程之 course id
    Course.findAll({
      where: { UserId: req.user.id },
      attributes: ['id']
    })
      .then(courses => {
        // 判斷該課程是否為 user 開立的課程
        const isUsersCourse = courses.map(course => (course.id)).includes(parseInt(req.body.courseId))
        // 是否為 admin
        const isAdmin = req.user.role === 'admin'
        // 若為 user 自己的課程或為 admin，則可以發文
        if (isUsersCourse || isAdmin) {
          CourseReviewPost.create({
            subject: req.body.subject,
            message: req.body.message,
            CourseId: req.body.courseId,
            UserId: req.user.id
          })
            .then(courseReviewPost => {
              return res.redirect(`/instructor/course-review-discuss?courseId=${req.body.courseId}`)
            })
        } else {
          return res.redirect('back')
        }
      })
  },
  // 回應於課程審核討論區
  leaveCourRevReply: (req, res) => {
    // 先找出該使用者所有開立的課程之 course id
    Course.findAll({
      where: { UserId: req.user.id },
      attributes: ['id']
    })
      .then(courses => {
        // 判斷該課程是否為 user 開立的課程
        const isUsersCourse = courses.map(course => (course.id)).includes(parseInt(req.query.courseId))
        // 是否為 admin
        const isAdmin = req.user.role === 'admin'
        // 若為 user 自己的課程或為 admin，則可以發文
        if (isUsersCourse || isAdmin) {
          CourseReviewReply.create({
            message: req.body.message,
            CourseReviewPostId: req.query.courseReviewPostId,
            UserId: req.user.id
          })
            .then(courseReviewReply => {
              return res.redirect('back')
            })
        } else {
          return res.redirect('back')
        }
      })

  },
}

module.exports = instructController
