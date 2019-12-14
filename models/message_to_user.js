'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message_to_User = sequelize.define('Message_to_User', {
    subject: DataTypes.STRING,
    body: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  Message_to_User.associate = function (models) {
    Message_to_User.belongsTo(models.User)
  };
  return Message_to_User;
};