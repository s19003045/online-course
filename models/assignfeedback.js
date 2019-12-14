'use strict';
module.exports = (sequelize, DataTypes) => {
  const AssignFeedback = sequelize.define('AssignFeedback', {
    comment: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    AssignmentId: DataTypes.INTEGER
  }, {});
  AssignFeedback.associate = function (models) {
    AssignFeedback.belongsTo(models.User)
    AssignFeedback.belongsTo(models.Assignment)
  };
  return AssignFeedback;
};