'use strict';
module.exports = (sequelize, DataTypes) => {
  const LessonUser = sequelize.define('LessonUser', {
    isfinished: DataTypes.BOOLEAN,
    finishedDate: DataTypes.DATE,
    LessonId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  LessonUser.associate = function (models) {
    LessonUser.belongsTo(models.User)
    LessonUser.belongsTo(models.Lesson)
  };
  return LessonUser;
};