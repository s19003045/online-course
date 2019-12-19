'use strict';
module.exports = (sequelize, DataTypes) => {
  const CourseCategory = sequelize.define('CourseCategory', {
    mainCategoName: DataTypes.STRING, //主要類別
    subCategoName: DataTypes.STRING //次要類別
  }, {});
  CourseCategory.associate = function (models) {
    CourseCategory.hasMany(models.Course)
  };
  return CourseCategory;
};