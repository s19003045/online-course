'use strict';
module.exports = (sequelize, DataTypes) => {
  const DiscussPost = sequelize.define('DiscussPost', {
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    CourseId: DataTypes.INTEGER
  }, {});
  DiscussPost.associate = function (models) {
    DiscussPost.belongsTo(models.User)
    DiscussPost.belongsTo(models.Course)
    DiscussPost.hasMany(models.DiscussReply)
  };
  return DiscussPost;
};