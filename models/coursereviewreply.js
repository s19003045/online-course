'use strict';
module.exports = (sequelize, DataTypes) => {
  const CourseReviewReply = sequelize.define('CourseReviewReply', {
    message: DataTypes.STRING,
    CourseReviewPostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  CourseReviewReply.associate = function (models) {
    CourseReviewReply.belongsTo(models.User)
    CourseReviewReply.belongsTo(models.CourseReviewPost)
  };
  return CourseReviewReply;
};