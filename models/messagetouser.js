'use strict';
module.exports = (sequelize, DataTypes) => {
  const MessageToUser = sequelize.define('MessageToUser', {
    subject: DataTypes.STRING, //給使用者的訊息主題
    body: DataTypes.STRING, //訊息的內容
    UserId: DataTypes.INTEGER //FK:使用者的 id
  }, {});
  MessageToUser.associate = function (models) {
    MessageToUser.belongsTo(models.User)
  };
  return MessageToUser;
};