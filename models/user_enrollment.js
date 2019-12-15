'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_enrollment = sequelize.define('User_enrollment', {
    timeStart: DataTypes.DATE,
    timeEnd: DataTypes.DATE,
    finishLessonCount: DataTypes.INTEGER,
    completeRate: DataTypes.INTEGER,
    prevReadLessonId: DataTypes.INTEGER,
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  User_enrollment.associate = function (models) {
    User_enrollment.belongsTo(models.User)
    User_enrollment.belongsTo(models.Course)
    User_enrollment.belongsTo(models.Lesson)
  };
  return User_enrollment;
};