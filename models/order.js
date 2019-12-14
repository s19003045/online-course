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
  Order.associate = function (models) {
    Order.hasMany(models.Payment)
    Order.belongsTo(models.User)
    Order.belongsToMany(models.Course, {
      as: 'items',
      through: {
        model: models.OrderItem, unique: false
      },
      foreignKey: 'OrderId'
    });
  };
  return Order;
};