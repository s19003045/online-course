'use strict';
module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    content: DataTypes.TEXT,
    image: DataTypes.STRING,
    assignFile: DataTypes.STRING,
    status: DataTypes.ENUM,
    grade: DataTypes.ENUM,
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    LessonId: DataTypes.INTEGER
  }, {});
  Assignment.associate = function(models) {
    // associations can be defined here
  };
  return Assignment;
};