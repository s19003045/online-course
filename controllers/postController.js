const db = require("../models");
const User = db.User;
const Course = db.Course;
const DiscussPost = db.DiscussPost;
const DiscussReply = db.DiscussReply;

const postController = {
  getCoursePost: (req, res) => {
    Course.findByPk(req.params.courses_id).then(course => {
      if (course) {
        DiscussPost.findAll({
          include: [
            User,
            {
              model: DiscussReply,
              include: [User]
            }
          ],
          where: [{ CourseId: course.id }],
          order: [["createdAt", "DESC"]]
        }).then(posts => {
          return res.render("post", {
            posts,
            postsLength: posts.length,
            courseId: course.id
          });

          // return res.json(posts);
        });
      } else {
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
    });
  },
  postDiscussPost: (req, res) => {
    if (req.body.subject === "" || req.body.message === "") {
      req.flash("error_messages", "請輸入標題及問題內容");
      return res.redirect("back");
    } else if (req.body.subject.length > 50 || req.body.subject.message > 150) {
      req.flash("error_messages", "標題字數需小於50字，問題字數需小於150字");
      return res.redirect("back");
    } else {
      DiscussPost.findOne({
        where: [{ subject: req.body.subject }]
      }).then(post => {
        if (post) {
          req.flash(
            "error_messages",
            "該問題已有使用者問過，請直接回覆之前的問題串即可"
          );
          return res.redirect("back");
        } else {
          DiscussPost.create({
            subject: req.body.subject,
            message: req.body.message,
            UserId: req.user.id,
            CourseId: req.params.course_id,
            createdAt: new Date(),
            updatedAt: new Date()
          }).then(user => {
            req.flash("success_messages", "收到您的提問，老師會儘速回覆給您");
            return res.redirect("back");
          });
        }
      });
    }
  },
  postDiscussReply: (req, res) => {
    if (req.body.message === "") {
      req.flash("error_messages", "請輸入回覆內容");
      return res.redirect("back");
    } else if (req.body.message.length > 200) {
      req.flash("error_messages", "回覆內容需小於200字");
      return res.redirect("back");
    } else {
      DiscussReply.create({
        message: req.body.message,
        DiscussPostId: req.params.post_id,
        UserId: req.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }).then(user => {
        req.flash("success_messages", "成功回覆問題！");
        return res.redirect("back");
      });
    }
  }
};

module.exports = postController;
