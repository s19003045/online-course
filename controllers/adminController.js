const db = require("../models");
const Course = db.Course
const User = db.User
const UserEnrollment = db.UserEnrollment
const Lesson = db.Lesson
const CourseReviewPost = db.CourseReviewPost
const CourseReviewReply = db.CourseReviewReply

const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 設定 model query 的 limit
const pageLimit = 50;

const adminController = {
  getDashboard: (req, res) => {
    return res.render('admin/dashboard')
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

    // 設定 model query 的 offset
    let offset = req.query.page ? (req.query.page - 1) * pageLimit : 0

    // 帶入 whereOption 及 orderOption
    Course.findAndCountAll({
      where: {
        [Op.or]: whereOption
      },
      order: [orderOption],
      limit: pageLimit,
      offset: offset
    })
      .then(result => {
        // data for pagination
        let page = Number(req.query.page) || 1
        let pages = Math.ceil(result.count / pageLimit)
        let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        let prev = page - 1 < 1 ? 1 : page - 1
        let next = page + 1 > pages ? pages : page + 1

        // return res.json(result)
        return res.render('admin/instructCourses', {
          courses: result.rows,
          filter_status,
          sortby,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
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

    // 設定 model query 的 offset
    let offset = req.query.page ? (req.query.page - 1) * pageLimit : 0

    Course.findAll({
      where: {
        [Op.or]: whereOption
      },
      // order: [orderOption],//order 不可與 limit,offset 一同使用
      limit: pageLimit,
      offset: offset,
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
        // data for pagination
        let page = Number(req.query.page) || 1
        let pages = Math.ceil(courses.length / pageLimit)
        let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        let prev = page - 1 < 1 ? 1 : page - 1
        let next = page + 1 > pages ? pages : page + 1

        return res.render('admin/instructStudents', {
          courses: courses,
          filter_status,
          sortby,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
  },
  // dashboard 的課程審核討論區
  courseReviwDiscuss: async (req, res) => {
    // filter_status 用於 handlebars
    req.query.courseId = req.query.courseId == undefined ? 'all' : req.query.courseId

    // 篩選課程清單
    const coursesForSelectOption = await Course.findAll({
      attributes: ['id', 'name']
    })

    // 設定 model query 的 offset
    let offset = req.query.page ? (req.query.page - 1) * pageLimit : 0

    // 篩選所有課程的所有審核課程討論
    if (req.query.courseId === 'all') {
      const coursesFiltered = await Course.findAndCountAll({
        attributes: ['id', 'name', 'image', 'status', 'CourseCategoryId', 'UserId', 'createdAt', 'updatedAt'],
        limit: pageLimit,
        offset: offset,
        distinct: true,
        order: [["updatedAt", "DESC"]],
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
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(coursesFiltered.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      return res.render('admin/courseReviewDiscuss', {
        courses: coursesFiltered.rows, user: req.user, courseId: req.query.courseId, coursesForSelectOption,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
    } else {
      // 篩選單一課程的審核討論
      const coursesFiltered = await Course.findAndCountAll({
        where: {
          id: req.query.courseId
        },
        attributes: ['id', 'name', 'image', 'status', 'CourseCategoryId', 'UserId', 'createdAt', 'updatedAt'],
        limit: pageLimit,
        offset: offset,
        distinct: true,
        order: [["updatedAt", "DESC"]],
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
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(coursesFiltered.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      return res.render('admin/courseReviewDiscuss', {
        courses: coursesFiltered.rows, user: req.user, courseId: req.query.courseId, coursesForSelectOption,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
    }

  },
  // 留言於課程審核討論區
  leaveCourRevPost: (req, res) => {
    // 先找出該使用者所有開立的課程之 course id
    Course.findAll({
      where: { UserId: req.user.id },
      attributes: ['id'],
      limit: pageLimit,
      offset: offset
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
              return res.redirect(`/admin/dashboard/course-review-discuss?courseId=${req.body.courseId}`)
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

module.exports = adminController
