const db = require("../models");

const courseController = {
  getCourses: (req, res) => {
    return res.render('index')
  }
}

module.exports = courseController