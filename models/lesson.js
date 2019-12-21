'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    lessonNumber: DataTypes.INTEGER,
    intro: DataTypes.STRING,
    title: DataTypes.STRING,
    contents: DataTypes.TEXT,
    image: DataTypes.STRING,
    totalTime: DataTypes.INTEGER, //該lesson 上課時數
    isPreview: DataTypes.BOOLEAN, //是否提供預覽
    visible: DataTypes.BOOLEAN, //是否要顯示
    CourseId: DataTypes.INTEGER
  }, {});
  Lesson.associate = function (models) {
    Lesson.belongsTo(models.Course)
    Lesson.hasMany(models.LessonUser)
    Lesson.hasMany(models.Assignment)
  };
  return Lesson;
};