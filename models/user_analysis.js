'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_analysis = sequelize.define('User_analysis', {
    message: DataTypes.STRING,
    enrollCourseNum: DataTypes.INTEGER,
    setCourseNum: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  User_analysis.associate = function(models) {
    // associations can be defined here
  };
  return User_analysis;
};