'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    description: DataTypes.TEXT,
    role: DataTypes.STRING, //角色有二種：user, admin
    country: DataTypes.STRING, //user 的國家
    timezone: DataTypes.STRING //user 的時區
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
    User.hasMany(models.Login) //登入時間記錄
    User.hasOne(models.UserAnalysis)
    User.hasOne(models.Reward) //獎勵機制
    // 這個使用者有收藏哪些課程
    User.belongsToMany(models.Course, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoriteCourses'
    })
  };
  return User;
};