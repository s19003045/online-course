'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    lessonNumber: DataTypes.INTEGER,
    intro: DataTypes.STRING,
    title: DataTypes.STRING,
    contents: DataTypes.TEXT,
    image: DataTypes.STRING,
    totalTime: DataTypes.INTEGER,
    isPreview: DataTypes.BOOLEAN,
    visible: DataTypes.BOOLEAN,
    CourseId: DataTypes.INTEGER
  }, {});
  Lesson.associate = function(models) {
    // associations can be defined here
  };
  return Lesson;
};