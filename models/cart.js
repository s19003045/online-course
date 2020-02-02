'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    UserId: DataTypes.INTEGER,
  }, {});
  Cart.associate = function (models) {
    Cart.belongsToMany(models.Course, {
      as: 'items',
      through: {
        model: models.CartItem, unique: false
      },
      foreignKey: 'CartId'
    })
  };
  return Cart;
};