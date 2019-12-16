'use strict';
module.exports = (sequelize, DataTypes) => {
  const CourseReviewPost = sequelize.define('CourseReviewPost', {
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  CourseReviewPost.associate = function (models) {
    CourseReviewPost.belongsTo(models.User)
    CourseReviewPost.belongsTo(models.Course)
    CourseReviewPost.hasMany(models.CourseReviewReply)
  };
  return CourseReviewPost;
};