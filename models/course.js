'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    introVideo: DataTypes.STRING,
    teacherName: DataTypes.STRING,
    teacherDescrip: DataTypes.STRING,
    totalTime: DataTypes.INTEGER,
    totalLessons: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    status: DataTypes.ENUM,
    submittedDate: DataTypes.DATE,
    intoMarketDate: DataTypes.DATE,
    ratingAverage: DataTypes.INTEGER,
    ratingCount: DataTypes.INTEGER,
    studentCount: DataTypes.INTEGER,
    CourseCategoId: DataTypes.INTEGER,
    TeacherId: DataTypes.INTEGER
  }, {});
  Course.associate = function(models) {
    // associations can be defined here
  };
  return Course;
};