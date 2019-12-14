'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discuss_Reply = sequelize.define('Discuss_Reply', {
    message: DataTypes.STRING,
    PostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Discuss_Reply.associate = function(models) {
    // associations can be defined here
  };
  return Discuss_Reply;
};