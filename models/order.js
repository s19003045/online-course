'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    sn: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    shipping_status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};