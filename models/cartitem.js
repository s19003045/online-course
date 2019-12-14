'use strict';
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    quantity: DataTypes.INTEGER,
    CartId: DataTypes.INTEGER,
    CourseId: DataTypes.INTEGER
  }, {});
  CartItem.associate = function(models) {
    // associations can be defined here
  };
  return CartItem;
};