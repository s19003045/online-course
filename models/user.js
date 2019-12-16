'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    description: DataTypes.TEXT,
    role: DataTypes.STRING,
    country: DataTypes.STRING,
    timezone: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.UserEnrollment)
    User.hasMany(models.Course)
    User.hasMany(models.CourseReviewPost)
    User.hasMany(models.CourseReviewReply)
    User.hasMany(models.LessonUser)
    User.hasMany(models.Rating)
    User.hasMany(models.DiscussPost)
    User.hasMany(models.DiscussReply)
    User.hasMany(models.Assignment)
    User.hasMany(models.AssignFeedback)
    User.hasMany(models.Order)
    User.hasMany(models.MessageToUser)
    User.hasOne(models.UserAnalysis)
    // 這個使用者有收藏哪些課程
    User.belongsToMany(models.Course, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoriteCourses'
    })
  };
  return User;
};