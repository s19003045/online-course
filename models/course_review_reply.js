'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course_review_reply = sequelize.define('Course_review_reply', {
    message: DataTypes.STRING,
    CourRevPostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Course_review_reply.associate = function(models) {
    // associations can be defined here
  };
  return Course_review_reply;
};