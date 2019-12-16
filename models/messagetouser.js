'use strict';
module.exports = (sequelize, DataTypes) => {
  const MessageToUser = sequelize.define('MessageToUser', {
    subject: DataTypes.STRING,
    body: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  MessageToUser.associate = function (models) {
    MessageToUser.belongsTo(models.User)
  };
  return MessageToUser;
};