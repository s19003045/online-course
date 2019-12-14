'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discuss_Reply = sequelize.define('Discuss_Reply', {
    message: DataTypes.STRING,
    PostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Discuss_Reply.associate = function (models) {
    Discuss_Reply.belongsTo(models.User)
    Discuss_Reply.belongsTo(models.Discuss_Post)
  };
  return Discuss_Reply;
};