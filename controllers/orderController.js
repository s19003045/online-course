const db = require("../models");
const Course = db.Course;
const UserEnrollment = db.UserEnrollment;
const Lesson = db.Lesson;
const LessonUser = db.LessonUser;

const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PWD,
  },
});

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
              // 建立LessonUser資料
              Lesson.findAll({
                where: {
                  CourseId: course.id
                },
                attribute: ["id"]
              }).then(lessons => {
                lessons.forEach(lesson => {
                  LessonUser.create({
                    isfinished: false,
                    LessonId: lesson.id,
                    UserId: req.user.id
                  });
                });
                req.flash("success_messages", `感謝您購買${course.name}課程`);
                res.redirect("back");
              });
            });
          }
        });
      } else {
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
    });
  },
  // 取得所有訂單
  getOrders: (req, res) => {
    Order.findAll({ include: 'items' }).then(orders => {
      // return res.json(orders)
      return res.render('shop/orders', {
        orders
      })
    })
  },
  // 送出訂單
  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {
      return Order.create({
        // name: req.body.name,
        // address: req.body.address,
        // phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
      }).then(order => {
        // console.log('cart:', cart)
        // console.log('order:', order)
        var results = [];
        for (var i = 0; i < cart.items.length; i++) {
          // console.log(order.id, cart.items[i].id)
          results.push(
            OrderItem.create({
              OrderId: order.id,
              CourseId: cart.items[i].id,
              price: cart.items[i].price,
              quantity: cart.items[i].CartItem.quantity,
            })
          );
        }

        var mailOptions = {
          from: process.env.GMAIL_ID,
          to: 's19003045+gameco@gmail.com',
          subject: `${order.id} 訂單成立`,
          text: `${order.id} 訂單成立`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        return Promise.all(results).then(() =>
          res.redirect('/orders')
        );

      })
    })
  },
  // 取消訂單
  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      }).then(order => {
        return res.redirect('back')
      })
    })
  },

  getPayment: (req, res) => {
    console.log('===== getPayment =====')
    console.log(req.params.id)
    console.log('==========')

    return Order.findByPk(req.params.id, {}).then(order => {
      return res.render('shop/payment', { order })
    })
  },
  newebpayCallback: (req, res) => {
    console.log('===== newebpayCallback =====')
    console.log(req.body)
    console.log('==========')

    return res.redirect('back')
  }
};

module.exports = orderController;
