'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Favorite.associate = function (models) {
    // 這邊不用定義
  };
  return Favorite;
};