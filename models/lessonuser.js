'use strict';
module.exports = (sequelize, DataTypes) => {
  const LessonUser = sequelize.define('LessonUser', {
    isfinished: DataTypes.BOOLEAN, //學生是否完成該 lesson
    finishedDate: DataTypes.DATE, //學生完成該 lesson 日期
    LessonId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  LessonUser.associate = function (models) {
    LessonUser.belongsTo(models.User)
    LessonUser.belongsTo(models.Lesson)
  };
  return LessonUser;
};