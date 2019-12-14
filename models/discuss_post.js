'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discuss_Post = sequelize.define('Discuss_Post', {
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    CourseId: DataTypes.INTEGER
  }, {});
  Discuss_Post.associate = function(models) {
    // associations can be defined here
  };
  return Discuss_Post;
};