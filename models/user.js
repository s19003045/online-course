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
    User.hasMany(models.User_enrollment)
    User.hasMany(models.Course)
    User.hasMany(models.Course_review_post)
    User.hasMany(models.Course_review_reply)
    User.hasMany(models.Lesson_user)
    User.hasMany(models.Rating)
    User.hasMany(models.Discuss_Post)
    User.hasMany(models.Discuss_Reply)
    User.hasMany(models.Assignment)
    User.hasMany(models.AssignFeedback)
    User.hasMany(models.Order)
    User.hasMany(models.Message_to_User)
    User.hasOne(models.User_analysis)
    // 這個使用者有收藏哪些課程
    User.belongsToMany(Course, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoriteCourses'
    })
  };
  return User;
};