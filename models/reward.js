'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reward = sequelize.define('Reward', {
    point: DataTypes.INTEGER, //使用者的點數
    UserId: DataTypes.INTEGER
  }, {});
  Reward.associate = function (models) {
    Reward.belongsTo(models.User)
  };
  return Reward;
};