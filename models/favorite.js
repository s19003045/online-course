"use strict";
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    "Favorite",
    {
      CourseId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER
    },
    {}
  );
  Favorite.associate = function(models) {
    Favorite.belongsTo(models.User);
    Favorite.belongsTo(models.Course);
  };
  return Favorite;
};
