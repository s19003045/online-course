'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserEnrollment = sequelize.define('UserEnrollment', {
    timeStart: DataTypes.DATE, //啟用課程日期，同購買日期
    timeEnd: DataTypes.DATE, //完課日期
    finishLessonCount: DataTypes.INTEGER, //已上完課程單元
    completeRate: DataTypes.INTEGER, //課程完成率
    prevReadLessonId: DataTypes.INTEGER, //上次閱讀到哪個 lesson
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  UserEnrollment.associate = function (models) {
    UserEnrollment.belongsTo(models.User)
    UserEnrollment.belongsTo(models.Course)
  };
  return UserEnrollment;
};