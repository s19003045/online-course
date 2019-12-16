'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserEnrollment = sequelize.define('UserEnrollment', {
    timeStart: DataTypes.DATE,
    timeEnd: DataTypes.DATE,
    finishLessonCount: DataTypes.INTEGER,
    completeRate: DataTypes.INTEGER,
    prevReadLessonId: DataTypes.INTEGER,
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  UserEnrollment.associate = function (models) {
    UserEnrollment.belongsTo(models.User)
    UserEnrollment.belongsTo(models.Course)
    UserEnrollment.belongsTo(models.Lesson)
  };
  return UserEnrollment;
};