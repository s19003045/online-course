'use strict';
module.exports = (sequelize, DataTypes) => {
  const DiscussReply = sequelize.define('DiscussReply', {
    message: DataTypes.STRING,
    DiscussPostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  DiscussReply.associate = function (models) {
    DiscussReply.belongsTo(models.User)
    DiscussReply.belongsTo(models.DiscussPost)
  };
  return DiscussReply;
};