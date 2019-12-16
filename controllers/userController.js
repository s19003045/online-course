const db = require("../models");


const userController = {
  createCourseIntro: (req, res) => {
    return res.send('createCourseIntro')
  },

  createCourseStep1: (req, res) => {
    return res.send('createCourseStep1')
  },

  createCourseStep2: (req, res) => {
    return res.send('createCourseStep2')
  },

  createCourseStep3: (req, res) => {
    return res.send('createCourseStep3')
  },

  createCourseStep4: (req, res) => {
    return res.send('createCourseStep4')
  },

  getTeachCourses: (req, res) => {
    return res.send('getTeachCourses')
  },

}

module.exports = userController
