'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    introVideo: DataTypes.STRING,
    teacherName: DataTypes.STRING,
    teacherDescrip: DataTypes.STRING,
    totalTime: DataTypes.INTEGER,
    totalLessons: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    status: DataTypes.ENUM('editted', 'submitted', 'approved', 'intoMarket', 'offMarket'),
    submittedDate: DataTypes.DATE,
    intoMarketDate: DataTypes.DATE,
    ratingAverage: DataTypes.INTEGER,
    ratingCount: DataTypes.INTEGER,
    studentCount: DataTypes.INTEGER,
    CourseCategoryId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Course.associate = function (models) {
    Course.belongsTo(models.User)  //一個課程被一個老師開課
    Course.belongsTo(models.CourseCategory)
    Course.hasMany(models.UserEnrollment)
    Course.hasMany(models.CourseReviewPost)
    Course.hasMany(models.Lesson)
    Course.hasMany(models.Rating)
    Course.hasMany(models.DiscussPost)
    Course.hasMany(models.Assignment)


    // 這課程被哪些使用者收藏
    Course.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'CourseId',
      as: 'FavoriteUsers'
    })
    Course.belongsToMany(models.Order, {
      as: 'orders',
      through: {
        model: models.OrderItem, unique: false
      },
      foreignKey: 'CourseId'
    })
    Course.belongsToMany(models.Cart, {
      as: 'carts',
      through: {
        model: models.CartItem, unique: false
      },
      foreignKey: 'CourseId'
    })
  };
  return Course;
};