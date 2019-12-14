const express = require("express");
const app = express();

// 判別開發環境
if (process.env.NODE_ENV !== "production") {
  // 如果不是 production 模式，使用 dotenv 讀取 .env 檔案
  require("dotenv").config();
}

const db = require("./models");
const helpers = require("./_helpers");
const exphbs = require("express-handlebars");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passport");
const methodOverride = require("method-override");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helpers")
  })
);
app.set("view engine", "handlebars");

app.use(
  session({ secret: "DennyJohnAbby", resave: false, saveUninitialized: false })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));

app.use("/upload", express.static(__dirname + "/upload"));
app.use(express.static("public"));

// 下面這二行是 AC 原始檔寫的
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");

  res.locals.user = helpers.getUser(req);
  next();
});

app.listen(port, () => console.log(`Express app listening on port ${port}!`));

require("./routes")(app, passport);

module.exports = app;
