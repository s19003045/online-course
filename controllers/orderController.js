const crypto = require("crypto")
const nodemailer = require('nodemailer');

const db = require("../models");
const Course = db.Course;
const UserEnrollment = db.UserEnrollment;
const Lesson = db.Lesson;
const LessonUser = db.LessonUser;
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart
const User = db.User
const CartItem = db.CartItem

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PWD,
  },
});

const URL = process.env.URL
const MerchantID = process.env.MerchantID
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
const PayGateWay = "https://ccore.spgateway.com/MPG/mpg_gateway"
const ReturnURL = URL + "/newebpay/callback?from=ReturnURL"
const NotifyURL = URL + "/newebpay/callback?from=NotifyURL"
const ClientBackURL = URL + "/orders"

function genDataChain(TradeInfo) {
  let results = [];
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`);
  }
  return results.join("&");
}

function create_mpg_aes_encrypt(TradeInfo) {
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
  return enc + encrypt.final("hex");
}

function create_mpg_aes_decrypt(TradeInfo) {
  let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
  decrypt.setAutoPadding(false);
  let text = decrypt.update(TradeInfo, "hex", "utf8");
  let plainText = text + decrypt.final("utf8");
  let result = plainText.replace(/[\x00-\x20]+/g, "");
  return result;
}


function create_mpg_sha_encrypt(TradeInfo) {

  let sha = crypto.createHash("sha256");
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  return sha.update(plainText).digest("hex").toUpperCase();
}

function getTradeInfo(Amt, Desc, email) {

  console.log('===== getTradeInfo =====')
  console.log(Amt, Desc, email)
  console.log('==========')

  data = {
    'MerchantID': MerchantID, // 商店代號
    'RespondType': 'JSON', // 回傳格式
    'TimeStamp': Date.now(), // 時間戳記
    'Version': 1.5, // 串接程式版本
    'MerchantOrderNo': Date.now(), // 商店訂單編號
    'LoginType': 0, // 智付通會員
    'OrderComment': 'OrderComment', // 商店備註
    'Amt': Amt, // 訂單金額
    'ItemDesc': Desc, // 產品名稱
    'Email': email, // 付款人電子信箱
    'ReturnURL': ReturnURL, // 支付完成返回商店網址
    'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
    'ClientBackURL': ClientBackURL, // 支付取消返回商店網址
  }

  console.log('===== getTradeInfo: data =====')
  console.log(data)


  mpg_aes_encrypt = create_mpg_aes_encrypt(data)
  mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

  console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
  console.log(mpg_aes_encrypt)
  console.log(mpg_sha_encrypt)

  tradeInfo = {
    'MerchantID': MerchantID, // 商店代號
    'TradeInfo': mpg_aes_encrypt, // 加密後參數
    'TradeSha': mpg_sha_encrypt,
    'Version': 1.5, // 串接程式版本
    'PayGateWay': PayGateWay,
    'MerchantOrderNo': data.MerchantOrderNo,
  }

  console.log('===== getTradeInfo: tradeInfo =====')
  console.log(tradeInfo)

  return tradeInfo
}


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
    const whereOption = {}
    let sort = req.query.sort || 'all'

    if (sort == 'all') {
      whereOption.UserId = req.user.id
    } else if (sort == 'notpayed') {
      whereOption.UserId = req.user.id
      whereOption.payment_status = 0
    } else if (sort == 'payed') {
      whereOption.UserId = req.user.id
      whereOption.payment_status = 1
    } else {
      whereOption.UserId = req.user.id
    }
    Order.findAll({
      where: whereOption,
      order: [['createdAt', 'DESC']],
      include: 'items'
    })
      .then(ordersFilter => {
        if (!ordersFilter) {
          req.flash('error_messages', '目前無任何訂單')
          return res.redirect('/')
        } else {
          const orders = ordersFilter.map((c) => ({
            ...c.dataValues,
            totalPrice: c.items.length > 0 ? c.items.map(d => d.OrderItem.price * d.OrderItem.quantity).reduce((a, b) => a + b) : 0,
            isDisplay: c.items.length === 0 ? false : true
          }))
          // 篩選後所有訂單中的商品數
          let orderListItems = 0
          orders.forEach(d => {
            orderListItems += d.items.length
          })
          // 是否要顯示 orderList
          let orderListDisplay = orderListItems === 0 ? false : true
          return res.render('shop/orders', {
            orders,
            sort,
            orderListDisplay
          })
        }
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
        UserId: req.user.id,
      }).then(order => {
        var results = [];
        for (var i = 0; i < cart.items.length; i++) {

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

        return Promise.all(results).then(() => {
          // 刪除該購物車之所有 cartItem
          return CartItem.destroy({
            where: { CartId: cart.id }
          })
            .then(cartItems => {
              return res.redirect('/orders?sort=notpayed')
            })
        });

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
  // 將訂單中的商品移至下次採買清單
  removeToNextBuy: (req, res) => {
    return Cart.findOne({
      where: { UserId: req.user.id }
    })
      .then(cart => {
        CartItem.findOrCreate({
          where: {
            status: 'inCart',
            CartId: cart.id,
            CourseId: req.query.courseid
          },
          default: {
            status: 'inCart',
            CartId: cart.id,
            CourseId: req.query.courseid
          }
        })
          .spread(function (cartItem, spread) {
            cartItem.update({
              quantity: 1,
            })
              .then(cartItem => {
                OrderItem.destroy({
                  where: {
                    OrderId: req.body.orderid,
                    CourseId: req.query.courseid
                  }
                })
                  .then(orderItem => {
                    return res.redirect('back')
                  })
              })
          })
      })
  },
  // 將訂單中的商品清除
  cancelOrderItem: (req, res) => {
    return OrderItem.destroy({
      where: {
        OrderId: req.body.orderid,
        CourseId: req.query.courseid
      }
    })
      .then(ordetItem => {
        return res.redirect('back')
      })
  },
  // 取得付款頁面
  getPayment: (req, res) => {
    return Order.findByPk(req.params.id, {
      include: [
        { model: Course, as: 'items', attributes: ['id', 'name'] },
        { model: User, attributes: ['email'] }
      ]
    }).then(order => {
      // return res.json(order)
      let courseString = ''
      order.items.forEach(d => {
        courseString += d.name
      })
      const tradeInfo = getTradeInfo(order.amount, courseString, order.User.email)
      order.update({
        ...req.body,
        sn: tradeInfo.MerchantOrderNo,
      }).then(order => {
        res.render('shop/payment', { order, tradeInfo })
      })
    })
  },
  newebpayCallback: (req, res) => {
    console.log('===== newebpayCallback =====')
    console.log(req.method)
    console.log(req.query)
    console.log(req.body)
    console.log('==========')

    console.log('===== newebpayCallback: TradeInfo =====')
    console.log(req.body.TradeInfo)

    const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

    console.log('===== newebpayCallback: create_mpg_aes_decrypt、data =====')
    console.log(data)

    if (req.body.Status === 'SUCCESS') {
      return Order.findAll({
        where: {
          sn: data['Result']['MerchantOrderNo']
        },
        include: 'items'
      }).then(orders => {
        // return res.json(orders)
        let courses = []
        // orders[0].items.forEach(item => {
        //   item
        // })
        orders[0].update({
          ...req.body,
          payment_status: 1,
        }).then(order => {
          req.flash('success_messages', '信用卡交易授權成功，成功購入課程！')
          return res.redirect('/orders')
        })
      })
    } else {
      req.flash('error_messages', `Error(${req.body.Status})，${req.body.Message}，未成功購買課程！`)
      return res.redirect('/orders')
    }

  }
};

module.exports = orderController;
