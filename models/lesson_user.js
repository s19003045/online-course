'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lesson_user = sequelize.define('Lesson_user', {
    isfinished: DataTypes.BOOLEAN,
    finishedDate: DataTypes.DATE,
    LessonId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Lesson_user.associate = function (models) {
    Lesson_user.belongsTo(models.User)
    Lesson_user.belongsTo(models.Lesson)
  };
  return Lesson_user;
};