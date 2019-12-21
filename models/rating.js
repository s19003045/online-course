'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: DataTypes.INTEGER, //評價分數
    comment: DataTypes.STRING, //評價內容
    UserId: DataTypes.INTEGER,
    CourseId: DataTypes.INTEGER
  }, {});
  Rating.associate = function (models) {
    Rating.belongsTo(models.User)
    Rating.belongsTo(models.Course)
  };
  return Rating;
};