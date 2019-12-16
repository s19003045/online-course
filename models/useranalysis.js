'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAnalysis = sequelize.define('UserAnalysis', {
    message: DataTypes.STRING,
    enrollCourseNum: DataTypes.INTEGER,
    setCourseNum: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  UserAnalysis.associate = function (models) {
    UserAnalysis.belongsTo(models.User)
  };
  return UserAnalysis;
};