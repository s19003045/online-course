const db = require("../models");
const Course = db.Course;
const User = db.User;
const UserEnrollment = db.UserEnrollment;
const Favorite = db.Favorite;
const Reward = db.Reward
const Login = db.Login
const Lesson = db.Lesson
const LessonUser = db.LessonUser

const rewardController = {
  getLottery: (req, res) => {
    User.findByPk(req.user.id).then(user => {
      return Reward.findOne({ where: { UserId: req.user.id } })
        .then(reward => {
          return res.render("gamification/lottery", { user, reward });
        })
    });
  },

  postLottery: (req, res) => {
    // 中獎機率50%
    let randomNumber = Math.floor(Math.random() * 2) + 1 //隨機為使用者挑戰號碼
    let answerNumber = Math.floor(Math.random() * 2) + 1 //正確數字
    const pointsForPlay = 100

    return Reward.findOne({ where: { UserId: req.user.id } })
      .then(reward => {
        // 判斷使用者點數是否足夠
        if (reward.point < pointsForPlay) {
          const prize = {
            message: '你的點數不夠喔！',
            course: null,
            price: null
          }
          return res.json(prize)
        } else {
          // 點數足夠可以轉扭蛋，先扣除使用者點數
          return reward.decrement('point', { by: pointsForPlay })
            .then(reward => {
              if (randomNumber === answerNumber) {
                return Course.findAndCountAll({ where: { status: 'intoMarket' } })
                  .then(data => {
                    // 所有上架課程的id
                    const courseIdIntoMarket = data.rows.map(item => (item.id))
                    // 找出該 user 所有課程
                    UserEnrollment.findAndCountAll({ where: { UserId: req.user.id } })
                      .then(enroll => {
                        // 所有該user有購買課程的id
                        const userEnrollCourseId = enroll.rows.map(item => (item.CourseId))
                        console.log('user bought course:', userEnrollCourseId)
                        // 從已上架的課程id中，刪除使用者已購買的課程(使用者已購買的課程，就不需要再送給使用者)
                        userEnrollCourseId.forEach((item, index) => {
                          let indexInArray = courseIdIntoMarket.indexOf(item)
                          if (indexInArray > -1) {
                            courseIdIntoMarket.splice(indexInArray, 1)
                          }
                        })
                        // 將篩選過的上架課程 id 放進另一個陣列中
                        const pickedCourseId = [...courseIdIntoMarket]
                        // 排除user已購買課之所有上架課程
                        let courseLength = pickedCourseId.length
                        // 隨機挑選一個號碼
                        let pickNumber = Math.floor(Math.random() * courseLength)
                        // 使用選中的課程名稱來找該課程
                        return Course.findOne({
                          where: {
                            id: pickedCourseId[pickNumber],
                            status: 'intoMarket'
                          }
                        })
                          .then(course => {
                            // course model的studentCount要加1
                            return Course.increment("studentCount", {
                              where: { id: course.id }
                            })
                              .then(increment => {
                                // 將課程加到使用者購買的課程中
                                return UserEnrollment.create({
                                  timeStart: new Date(),
                                  CourseId: course.id,
                                  UserId: req.user.id
                                }).then(userEnroll => {
                                  // 建立LessonUser資料
                                  return Lesson.findAll({
                                    where: {
                                      CourseId: course.id
                                    },
                                    attributes: ["id"]
                                  }).then(lessons => {
                                    // 先建立一個空的 addLessons 陣列，用來存放所有 promise 物件
                                    const addLessons = []
                                    for (let i = 0; i < lessons.length; i++) {
                                      addLessons.push(LessonUser.create({
                                        isfinished: false,
                                        LessonId: lessons[i].id,
                                        UserId: req.user.id
                                      }))
                                    }
                                    const prize = {
                                      message: '恭禧你中獎了！',
                                      course: course.name,
                                      courseId: course.id,
                                      price: course.price
                                    }
                                    Promise.all(addLessons).then(values => {
                                      return res.json(prize)
                                    })
                                  })
                                });
                              });
                          })
                      })
                  })
              } else {
                const prize = {
                  message: '真可惜！你沒有抽中喔！',
                  course: null,
                  price: null
                }
                return res.json(prize)
              }
            })
        }
      })
  }
};

module.exports = rewardController;