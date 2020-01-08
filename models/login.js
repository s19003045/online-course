'use strict';
module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define('Login', {
    loginDate: DataTypes.DATE, //登入時間記錄
    UserId: DataTypes.INTEGER
  }, {});
  Login.associate = function (models) {
    Login.belongsTo(models.User)
  };
  return Login;
};