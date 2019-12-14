'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lesson_user = sequelize.define('Lesson_user', {
    isfinished: DataTypes.BOOLEAN,
    finishedDate: DataTypes.DATE,
    LessonId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Lesson_user.associate = function(models) {
    // associations can be defined here
  };
  return Lesson_user;
};