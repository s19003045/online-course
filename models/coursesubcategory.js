'use strict';
module.exports = (sequelize, DataTypes) => {
  const CourseSubCategory = sequelize.define('CourseSubCategory', {
    name: DataTypes.STRING,  //次要類別名稱 
    CourseCategoryId: DataTypes.INTEGER //外鍵：主要類別 id
  }, {});
  CourseSubCategory.associate = function (models) {
    CourseSubCategory.belongsTo(models.CourseCategory)
    CourseSubCategory.hasMany(models.Course)
  };
  return CourseSubCategory;
};