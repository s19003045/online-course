'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discuss_Post = sequelize.define('Discuss_Post', {
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    CourseId: DataTypes.INTEGER
  }, {});
  Discuss_Post.associate = function (models) {
    Discuss_Post.belongsTo(models.User)
    Discuss_Post.belongsTo(models.Course)
    Discuss_Post.hasMany(models.Discuss_Reply)
  };
  return Discuss_Post;
};