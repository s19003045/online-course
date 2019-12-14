'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course_category = sequelize.define('Course_category', {
    mainCategoName: DataTypes.STRING,
    subCategoName: DataTypes.STRING
  }, {});
  Course_category.associate = function (models) {
    Course_category.hasMany(models.Course)
  };
  return Course_category;
};