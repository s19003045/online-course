$(document).ready(function () {
  // 確認購物車中商品數量(每次到新頁面都會執行，以校正購物車中商品數量)
  // 取得的購物車中商品數量，先放至 local storage，再從 Local storage 取出，顯示在購物車 icon 數量上
  axios.get('/cart/checkcartitems')
    .then(res => {
      let data
      if (!localStorage.getItem('shopcart')) {
        data = {
          itemCount: 0
        }
        // 放回 localstrorage
        localStorage.setItem('shopcart', JSON.stringify(data))

        // 取出回傳的值，並放進 localstorage
        data.itemCount = res.data.itemCount
        $("#shopcart span").attr('data-count', data.itemCount)

        // 放回 localstrorage
        localStorage.setItem('shopcart', JSON.stringify(data))
      } else {
        let data = JSON.parse(localStorage.getItem('shopcart'))
        if (res.data.status === 'success') {
          // 取出回傳的值，並放進 localstorage
          data.itemCount = res.data.itemCount
          $("#shopcart span").attr('data-count', data.itemCount)

          // 放回 localstrorage
          localStorage.setItem('shopcart', JSON.stringify(data))
        }
      }
    })
    .catch(err => {
      console.log(err)
    })

  // 點擊〈放入購物車〉的動作
  $('.shop-grid').click(function (event) {
    event.preventDefault()
    let buyBtnParent = $(event.target).parents("form.course-item")
    let courseId = buyBtnParent.children("input").val()

    // 發送非同步請求
    axios.post(
      `/cart`,
      {
        courseId: courseId
      }
    )
      .then(res => {
        let data = JSON.parse(localStorage.getItem('shopcart'))

        // 儲改 itemCount
        if (res.data.status === 'success') {
          // 取出回傳的值，並放進 localstorage
          data.itemCount = res.data.itemCount
          $("#shopcart span").attr('data-count', data.itemCount)

          // 放回 localstrorage
          localStorage.setItem('shopcart', JSON.stringify(data))

          let message = res.data.message
          // 跳出訊息視窗
          $('.shop-message').text(message)

          // 訊息視窗
          $("#myModal a.btn").on("click", function (e) {
            // just as an example...
            $("#myModal").modal('hide'); // dismiss the dialog
          });

          $("#myModal").on("hide", function () { // remove the event listeners when the dialog is dismissed
            $("#myModal a.btn").off("click");
          });

          $("#myModal").on("hidden", function () { // remove the actual elements from the DOM when fully hidden
            $("#myModal").remove();
          });

          $("#myModal").modal({ // wire up the actual modal functionality and show the dialog
            "backdrop": "static",
            "keyboard": true,
            "show": true // ensure the modal is shown immediately
          });

        }
      })
      .catch(err => {
        console.log(err);
      })
  })

  // 刪除購物車中物品的動作
  $('.shopping-cart-items').click(function (event) {
    event.preventDefault()
    // 取得 cartItem id
    let cartItemId = $(event.target).parents('.remove-item-from-Cart').attr('data-cartitemid')
    // 取得 cart id
    let cartId = $(event.target).parents('.remove-item-from-Cart').attr('data-cartid')

    // 發送非同步請求
    axios.post(
      `/cartItem/${cartItemId}?_method=DELETE`,
      {
        cartid: cartId
      }
    )
      .then(res => {
        let data = JSON.parse(localStorage.getItem('shopcart'))

        // 儲改 itemCount
        if (res.data.status === 'success') {
          // 取出回傳的值，並放進 localstorage
          data.itemCount = res.data.itemCount
          // 更正 shopcart icon 的商品數字
          $("#shopcart span").attr('data-count', data.itemCount)
          // 重新計算 total price
          let totalPrice = 0
          res.data.items.forEach(d => {
            totalPrice += d.price * 1 //數量
          })
          // 顯示總價
          $("#totalPrice").text(`${totalPrice}  元`)

          // 重新計算 商品數
          let itemCount = res.data.items.length
          // 變更 message: 購物車明細
          let message = `類物車明細  共 ${itemCount} 項商品`
          $('.shopping-detail-msg').text(message)

          // 送出請求成功刪除該物品後，將該列移除
          $(event.target).parents('tr').remove()

          // 放回 localstrorage
          localStorage.setItem('shopcart', JSON.stringify(data))

          let messageToUser = res.data.message
          // 跳出訊息視窗
          $('.shop-message').text(messageToUser)

          // 訊息視窗
          $("#myModal a.btn").on("click", function (e) {
            // just as an example...
            $("#myModal").modal('hide'); // dismiss the dialog
          });

          $("#myModal").on("hide", function () { // remove the event listeners when the dialog is dismissed
            $("#myModal a.btn").off("click");
          });

          $("#myModal").on("hidden", function () { // remove the actual elements from the DOM when fully hidden
            $("#myModal").remove();
          });

          $("#myModal").modal({ // wire up the actual modal functionality and show the dialog
            "backdrop": "static",
            "keyboard": true,
            "show": true // ensure the modal is shown immediately
          });

        }
      })
      .catch(err => {
        console.log(err);
      })
  })

  // 點擊登出按扭時，清空 localstorage
  $("#logout").click(function (event) {
    event.preventDefault()

    // 發送請求登出
    axios.get('/logout')
      .then(res => {
        // 更正 shopcart icon 的商品數字為
        $("#shopcart span").attr('data-count', 0)
        // 清空 localstorage
        localStorage.removeItem('shopcart')
        if (res.data.redirect == '/') {
          window.location = "/index"
        } else if (res.data.redirect == '/signin') {
          window.location = "/signin"
        }
      })
      .catch(err => {
        console.log(err)
      })
  })


})
