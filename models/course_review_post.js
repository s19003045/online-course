'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course_review_post = sequelize.define('Course_review_post', {
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Course_review_post.associate = function (models) {
    Course_review_post.belongsTo(models.User)
    Course_review_post.belongsTo(models.Course)
    Course_review_post.hasMany(models.Course_review_reply)
  };
  return Course_review_post;
};