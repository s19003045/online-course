'use strict';
module.exports = (sequelize, DataTypes) => {
  const DiscussPost = sequelize.define('DiscussPost', {
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    UserId: DataTypes.INTEGER,  //發言者
    CourseId: DataTypes.INTEGER //針對哪一個課程
  }, {});
  DiscussPost.associate = function (models) {
    DiscussPost.belongsTo(models.User)
    DiscussPost.belongsTo(models.Course)
    DiscussPost.hasMany(models.DiscussReply)
  };
  return DiscussPost;
};