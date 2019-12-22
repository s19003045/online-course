const db = require("../models");
const User = db.User;
const Course = db.Course;
const DiscussPost = db.DiscussPost;
const DiscussReply = db.DiscussReply;

const postController = {
  getCoursePost: (req, res) => {
    console.log(req.params.courses_id);
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
        console.log("error");
        req.flash("error_messages", "該課程不存在！");
        res.redirect("back");
      }
    });
  }
};

module.exports = postController;
