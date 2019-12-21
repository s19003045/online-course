'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAnalysis = sequelize.define('UserAnalysis', {
    message: DataTypes.STRING,
    enrollCourseNum: DataTypes.INTEGER, //參與的課程數
    setCourseNum: DataTypes.INTEGER, //建立的課程數
    UserId: DataTypes.INTEGER
  }, {});
  UserAnalysis.associate = function (models) {
    UserAnalysis.belongsTo(models.User)
  };
  return UserAnalysis;
};