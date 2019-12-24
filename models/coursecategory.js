'use strict';
module.exports = (sequelize, DataTypes) => {
  const CourseCategory = sequelize.define('CourseCategory', {
    name: DataTypes.STRING  //主要類別名稱 
  }, {});
  CourseCategory.associate = function (models) {
    CourseCategory.hasMany(models.CourseSubCategory)
    CourseCategory.hasMany(models.Course)
  };
  return CourseCategory;
};