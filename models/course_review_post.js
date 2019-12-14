'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course_review_post = sequelize.define('Course_review_post', {
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Course_review_post.associate = function(models) {
    // associations can be defined here
  };
  return Course_review_post;
};