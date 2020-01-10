'use strict';
module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define('Login', {
    loginDate: DataTypes.DATE, //登入時間記錄
    day: DataTypes.STRING, //將日期時間轉換成日期(無時間)
    UserId: DataTypes.INTEGER
  }, {});
  Login.associate = function (models) {
    Login.belongsTo(models.User)
  };
  return Login;
};