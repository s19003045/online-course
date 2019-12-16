'use strict';
module.exports = (sequelize, DataTypes) => {
  const CourseCategory = sequelize.define('CourseCategory', {
    mainCategoName: DataTypes.STRING,
    subCategoName: DataTypes.STRING
  }, {});
  CourseCategory.associate = function (models) {
    CourseCategory.hasMany(models.Course)
  };
  return CourseCategory;
};