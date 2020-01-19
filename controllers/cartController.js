const db = require("../models");
const Course = db.Course;
const User = db.User;
const Cart = db.Cart
const CartItem = db.CartItem


const cartController = {
  // 取得購物車所有東西
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId,
      { include: 'items' }
    )
      .then(cart => {
        cart = cart || { items: [] }
        let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0 //reduce 用法：arr.reduce(callback[accumulator, currentValue, currentIndex, array], initialValue)
        return res.render('shop/cart', {
          cart,
          totalPrice
        })
      })
  },
  // 新增物品至購物車
  postCart: (req, res) => {
    console.log(req.session)
    return Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0
      }
    })
      .spread(function (cart, created) {
        console.log('######cart:', cart)
        console.log('#####created:', created)
        console.log('session after postCart:', req.session)
        CartItem.findOrCreate({
          where: {
            CartId: cart.id,
            CourseId: req.body.courseId
          },
          default: {
            CartId: cart.id,
            CourseId: req.body.courseId
          }
        })
          .spread(function (cartItem, created) {
            console.log('cartItem:', cartItem)
            cartItem.update({
              quantity: 1,
            })
              .then(cartItem => {
                console.log(cartItem)
                req.session.cartId = cart.id
                return req.session.save(() => {
                  console.log(req.session)
                  return res.redirect('back')
                })
              })
          })
      })
  },
  // 刪除購物車中的物品
  deleteCartItem: (req, res) => {
    return CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.destroy()
          .then((cartItem) => {
            return res.redirect('back')
          })
      })
  },
}

module.exports = cartController