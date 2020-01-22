const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt-nodejs");
const db = require("../models");
const User = db.User;
const UserEnrollment = db.UserEnrollment;

// setup passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    // authenticate user
    (req, username, password, cb) => {
      console.log('======req.session.returnTo in passport.js====')
      console.log(req.session.returnTo)
      console.log('.........')

      User.findOne({ where: { email: username } }).then(user => {
        if (!user)
          return cb(
            null,
            false,
            req.flash("error_messages", "帳號或密碼輸入錯誤！")
          );
        if (!bcrypt.compareSync(password, user.password))
          return cb(
            null,
            false,
            req.flash("error_messages", "帳號或密碼輸入錯誤！")
          );
        // 登入前請求的網址存進 user 中，便於 userController.signIn 使用
        user.returnUrl = req.session.returnTo
        return cb(null, user);
      });
    }
  )
);

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [UserEnrollment]
  }).then(user => {
    return cb(null, user);
  });
});

module.exports = passport;
