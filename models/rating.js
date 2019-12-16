'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    CourseId: DataTypes.INTEGER
  }, {});
  Rating.associate = function (models) {
    Rating.belongsTo(models.User)
    Rating.belongsTo(models.Course)
  };
  return Rating;
};