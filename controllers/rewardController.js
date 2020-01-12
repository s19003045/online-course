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
  // 抽獎頁面
  getLottery: (req, res) => {
    User.findByPk(req.user.id).then(user => {
      return Reward.findOne({ where: { UserId: req.user.id } })
        .then(reward => {
          return res.render("gamification/lottery", { user, reward });
        })
    });
  },
  // 抽獎action
  postLottery: (req, res) => {
    // 中獎機率50%
    let randomNumber = Math.floor(Math.random() * 2) //隨機為使用者挑戰號碼
    let answerNumber = Math.floor(Math.random() * 2) //正確數字
    const pointsForPlay = 100 //一次扣100點

    return Reward.findOne({ where: { UserId: req.user.id } })
      .then(reward => {
        // 判斷使用者點數是否足夠
        if (reward.point < pointsForPlay) {
          const prize = {
            message: '你的點數不夠喔！',
            course: null,
            price: null,
            point: reward.point
          }
          return res.json(prize)
        } else {
          // 須先撈出抽獎清單(排出使用者已購買的課程)，再讓使用者抽。若使用者已購買所有課程，則沒有課程可以讓使用者抽。
          return Course.findAndCountAll({ where: { status: 'intoMarket' } })
            .then(data => {
              // 所有上架課程的id
              const courseIdIntoMarket = data.rows.map(item => (item.id))
              // 找出該 user 所有課程
              UserEnrollment.findAndCountAll({ where: { UserId: req.user.id } })
                .then(enroll => {
                  // 所有該user有購買課程的id
                  const userEnrollCourseId = enroll.rows.map(item => (item.CourseId))
                  // 從已上架的課程id中，刪除使用者已購買的課程(使用者已購買的課程，就不需要再送給使用者)
                  userEnrollCourseId.forEach((item, index) => {
                    let indexInArray = courseIdIntoMarket.indexOf(item)
                    if (indexInArray > -1) {
                      courseIdIntoMarket.splice(indexInArray, 1)
                    }
                  })
                  // 將篩選過的上架課程 id 放進另一個陣列中
                  const pickedCourseId = [...courseIdIntoMarket]
                  // 排除user已購買課之所有上架課程總數
                  let courseLength = pickedCourseId.length
                  // 隨機挑選一個號碼
                  let pickNumber = Math.floor(Math.random() * courseLength)

                  // 若使用者已購買所有課程，則沒有課程可以抽獎了
                  if (courseLength == 0) {
                    const prize = {
                      message: '你已購買所有課程，沒有課程讓你抽了！',
                      course: null,
                      price: null,
                      point: reward.point
                    }
                    return res.json()
                  } else {
                    // 有課程可以讓使用者抽，先扣點數
                    return Reward.decrement('point', {
                      where: { UserId: req.user.id },
                      by: pointsForPlay //一次扣100點
                    })
                      .then(decrementNumber => {
                        // Reward.decrement 回傳的promise不包含剩餘點數的資訊，必須以 Reward.findOne 回傳的promise才有剩餘點數的資訊
                        return Reward.findOne({ where: { UserId: req.user.id } })
                          .then(rewardLeft => {
                            console.log('========初始點數：', reward.point, '======剩餘點數：', rewardLeft.point)

                            if (randomNumber === answerNumber) {
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
                                          Promise.all(addLessons).then(values => {
                                            const prize = {
                                              message: '恭禧你中獎了！',
                                              course: course.name,
                                              courseId: course.id,
                                              price: course.price,
                                              point: rewardLeft.point
                                            }
                                            return res.json(prize)
                                          })
                                        })
                                      });
                                    });
                                })
                            } else {
                              const prize = {
                                message: '真可惜！你沒有抽中喔！',
                                course: null,
                                price: null,
                                point: rewardLeft.point
                              }
                              return res.json(prize)
                            }
                          })

                      })
                  }
                })
            })
        }
      })
  },

};

module.exports = rewardController;