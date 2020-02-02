const db = require("../models");
const Course = db.Course;
const User = db.User;
const Cart = db.Cart
const CartItem = db.CartItem


const cartController = {
  // 取得購物車所有東西
  getCart: (req, res) => {
    // 區分使用者是否登入
    // 一個使用者只會有一個購物車
    if (req.user) {
      return Cart.findOne({
        where: { UserId: req.user.id },
        include: 'items',
      })
        .then(cart => {
          // 若使用者無購物車，則新增一個購物車
          if (!cart) {
            Cart.create({ UserId: req.user.id })
              .then((cart) => {
                cart.items = []
                let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0 //reduce 用法：arr.reduce(callback[accumulator, currentValue, currentIndex, array], initialValue)

                // 計算在購物車內的商品數量
                let itemCount = 0
                cart.items.forEach(item => {
                  if (item.CartItem.status == 'inCart') {
                    itemCount += 1
                  }
                })
                // 購物車是否有物品
                let isProductInCart = itemCount > 0 ? true : false
                // 要給使用者的訊息
                let message = isProductInCart ? `共 ${itemCount} 項商品` : ' (購物車內無商品)'

                return res.render('shop/cart', {
                  cart,
                  totalPrice,
                  isProductInCart,
                  itemCount,
                  cartItemCount: itemCount,
                  message,
                  user: req.user
                })
              })
          } else {
            cart = cart || { items: [] }
            let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0 //reduce 用法：arr.reduce(callback[accumulator, currentValue, currentIndex, array], initialValue)

            // 計算在購物車內的商品數量
            let itemCount = 0
            cart.items.forEach(item => {
              if (item.CartItem.status == 'inCart') {
                itemCount += 1
              }
            })
            // 購物車是否有物品
            let isProductInCart = itemCount > 0 ? true : false
            // 要給使用者的訊息
            let message = isProductInCart ? `共 ${itemCount} 項商品` : ' (購物車內無商品)'

            return res.render('shop/cart', {
              cart,
              totalPrice,
              itemCount,
              isProductInCart,
              message,
              user: req.user
            })
          }
        })
    } else {
      return Cart.findByPk(req.session.cartId,
        { include: 'items' }
      )
        .then(cart => {
          cart = cart || { items: [] }
          let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0 //reduce 用法：arr.reduce(callback[accumulator, currentValue, currentIndex, array], initialValue)

          // 計算在購物車內的商品數量
          let itemCount = 0
          cart.items.forEach(item => {
            if (item.CartItem.status == 'inCart') {
              itemCount += 1
            }
          })
          // 購物車是否有物品
          let isProductInCart = itemCount > 0 ? true : false
          // 要給使用者的訊息
          let message = isProductInCart ? `共 ${itemCount} 項商品` : ' (購物車內無商品)'

          return res.render('shop/cart', {
            cart,
            totalPrice,
            itemCount,
            isProductInCart,
            message,
            user: req.user
          })
        })
    }
  },
  // 新增物品至購物車
  postCart: (req, res) => {
    if (req.user) {
      return Cart.findOrCreate({
        where: {
          UserId: req.user.id || 0
        },
        include: 'items'
      })
        .spread(function (cart, created) {

          CartItem.findOrCreate({
            where: {
              status: 'inCart',
              CartId: cart.id,
              CourseId: req.body.courseId
            },
            default: {
              status: 'inCart',
              CartId: cart.id,
              CourseId: req.body.courseId
            }
          })
            .spread(function (cartItem, created) {
              cartItem.update({
                quantity: 1,
              })
                .then(cartItem => {
                  Cart.findOne({
                    where: { id: cart.id },
                    include: 'items'
                  })
                    .then(cart => {
                      req.session.cartId = cart.id
                      return req.session.save(() => {
                        const shopcart = {
                          status: 'success',
                          message: '已加入購物車',
                          itemCount: cart.items.length,
                          items: cart.items
                        }
                        return res.json(shopcart)
                      })
                    })

                })
            })
        })
    } else {
      return Cart.findOrCreate({
        where: {
          id: req.session.cartId || 0
        },
        include: 'items'
      })
        .spread(function (cart, created) {
          CartItem.findOrCreate({
            where: {
              status: 'inCart',
              CartId: cart.id,
              CourseId: req.body.courseId
            },
            default: {
              status: 'inCart',
              CartId: cart.id,
              CourseId: req.body.courseId
            }
          })
            .spread(function (cartItem, created) {
              cartItem.update({
                quantity: 1,
              })
                .then(cartItem => {
                  Cart.findOne({
                    where: { id: cart.id },
                    include: 'items'
                  })
                    .then(cart => {
                      req.session.cartId = cart.id
                      return req.session.save(() => {
                        const shopcart = {
                          status: 'success',
                          message: '已加入購物車',
                          itemCount: cart.items ? cart.items.length : 0,
                          items: cart.items
                        }
                        return res.json(shopcart)
                      })
                    })

                })
            })
        })
    }
  },
  // 刪除購物車中的物品
  deleteCartItem: (req, res) => {
    return CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.destroy()
          .then((cartItem) => {
            Cart.findOne({
              where: {
                id: req.body.cartid
              },
              include: 'items'
            })
              .then(cart => {
                const shopcart = {
                  status: 'success',
                  message: '已將該商品從購物車中移除',
                  itemCount: cart.items.length,
                  items: cart.items
                }
                return res.json(shopcart)
                return res.redirect('back')
              })
          })
      })
  },
  // 登入後才會進入 checkoutCart
  checkoutCart: (req, res) => {

    // 查看使用者有無之前使用的購物車
    Cart.findOne({
      where: {
        UserId: req.user.id
      },
      include: 'items'
    })
      .then(cartAfterLogin => {
        //  登入前有使用臨時購物車，使用者也有自己的購物車，則需合併購物車的物品
        if (cartAfterLogin) {
          if (req.query.cartid) {
            Cart.findByPk(req.query.cartid, { include: 'items' })
              .then(cartBeforeLog => {
                // 合併購物車(將臨時購物車的商品加至永久購物車)

                // 需要新增至 使用者自己購物車的商品 id 放至 cartItemAdd
                const cartItemAdd = []
                // 臨時購物車的商品 id 集合
                const cartBefLogItems = []
                // 使用者購物車中的商品 id 集合
                const cartAftLogItems = []
                // 須判斷購物車中有無商品
                cartBeforeLog.items.forEach(course => {
                  cartBefLogItems.push(course.id)
                })
                cartAfterLogin.items.forEach(course => {
                  cartAftLogItems.push(course.id)
                })
                // [1,2,3,4,5] before
                // [3,4,5,6,7] after
                // 比對臨時購物車，把使用者自己購物車沒有的商品加進去
                cartBefLogItems.forEach(id => {
                  if (!cartAftLogItems.includes(id)) {
                    cartItemAdd.push(id)
                  }
                })
                // 把 promise 全放進 results
                var results = [];
                for (let i = 0; i < cartItemAdd.length; i++) {
                  results.push(
                    CartItem.create({
                      status: 'inCart',
                      quantity: 1,
                      CartId: cartAfterLogin.id,
                      CourseId: cartItemAdd[i]
                    })
                  )
                }
                return Promise.all(results).then(() =>
                  // 刪除臨時購物車
                  cartBeforeLog.destroy()
                    .then(() => {
                      res.redirect('/cart')
                    })
                );
              })
          } else {
            // 使用者有自己的購物車，但登入前未使用臨時購物車
            // return res.json(cartAfterLogin)
            return res.redirect('/cart')
          }
        } else {
          // 當使用者無購物車時，則延用未登入前的臨時購物車
          if (req.query.cartid) {
            Cart.findByPk(req.query.cartid, {
              include: 'items'
            })
              .then(cartBeforeLogin => {
                cartBeforeLogin.update({ UserId: req.user.id })
                  .then(cartAfterLogin => {
                    // return res.json(cartAfterLogin)
                    return res.redirect('/cart')
                  })
              })
          } else {
            // 使用者無自己的購物車，登入前也未使用臨時購物車
            return res.redirect('/cart')
          }
        }
      })
  },
  // 查詢購物車數量
  checkCartItems: (req, res) => {
    // 先判斷是否為使用者
    if (!req.user) {
      let cartId = req.session.cartId ? req.session.cartId : undefined

      if (cartId === undefined) {
        const shopcart = {
          status: 'success',
          message: '購物車中沒有商品',
          itemCount: 0
        }
        return res.json(shopcart)
      } else (
        Cart.findOne({
          where: {
            id: req.session.cartId
          },
          include: 'items'
        })
          .then(cart => {
            const shopcart = {
              status: 'success',
              message: '已將該商品從購物車中移除',
              itemCount: cart.items.length,
              items: cart.items
            }
            return res.json(shopcart)
          })
      )
    } else {
      // 使用已登入
      Cart.findOne({
        where: {
          UserId: req.user.id
        },
        include: 'items'
      })
        .then(cart => {
          const shopcart = {
            status: 'success',
            message: `購物車中有 ${cart.items.length} 項商品`,
            itemCount: cart.items.length,
            items: cart.items
          }
          return res.json(shopcart)
        })
    }
  }

}

module.exports = cartController