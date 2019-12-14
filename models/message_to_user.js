'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message_to_User = sequelize.define('Message_to_User', {
    subject: DataTypes.STRING,
    body: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  Message_to_User.associate = function(models) {
    // associations can be defined here
  };
  return Message_to_User;
};