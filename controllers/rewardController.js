const db = require("../models");
const Course = db.Course;
const User = db.User;
const UserEnrollment = db.UserEnrollment;
const Favorite = db.Favorite;
const Reward = db.Reward
const Login = db.Login

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
    // 中獎機率20%
    let randomNumber = Math.floor(Math.random() * 5) + 1 //隨機為使用者挑戰號碼
    let answerNumber = Math.floor(Math.random() * 5) + 1 //正確數字
    const pointsForPlay = 1 //先設定2(測試用)，等功能無誤後改為100

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

          // req.flash('error_messages', '你的點數不夠喔！')
          // return res.redirect('back')
        } else {
          // 點數足夠可以轉扭蛋，先扣除使用者點數
          return reward.decrement('point', { by: pointsForPlay })
            .then(reward => {
              if (randomNumber === answerNumber) {
                return Course.findAndCountAll()
                  .then(data => {
                    let courseLength = data.count
                    let pickNumber = Math.floor(Math.random() * courseLength) + 1
                    return Course.findByPk(pickNumber)
                      .then(course => {
                        // 將課程加到使用者購買的課程中
                        UserEnrollment.create({
                          timeStart: new Date(),
                          finishLessonCount: 0,
                          completeRate: 0,
                          prevReadLessonId: 1,
                          CourseId: course.id,
                          UserId: req.user.id
                        })
                          .then(enroll => {
                            const prize = {
                              message: '恭禧你中獎了！',
                              course: course.name,
                              price: course.price
                            }
                            req.flash('success_messages', `恭禧你中${course.name}，價值${course.price}`)
                            return res.json(prize)
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

                // req.flash('error_messages', '真可惜！你沒有抽中喔！')
                // return res.redirect('back')
              }
            })
        }
      })
  }
};

module.exports = rewardController;