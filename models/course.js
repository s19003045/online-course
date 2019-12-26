'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: DataTypes.STRING, //課程名稱
    description: DataTypes.STRING, //課程簡介
    image: DataTypes.STRING, //課程圖片(類似 avatar)
    introVideo: DataTypes.STRING, //預覽影片
    teacherName: DataTypes.STRING, //教師姓名
    teacherDescrip: DataTypes.STRING, //教師簡介
    totalTime: DataTypes.INTEGER, //課程總時數
    totalLessons: DataTypes.INTEGER, //lessons 總數
    price: DataTypes.INTEGER, //價錢
    status: DataTypes.ENUM('editted', 'submitted', 'approved', 'intoMarket', 'offMarket'), //課程狀態
    submittedDate: DataTypes.DATE, //送審日期
    intoMarketDate: DataTypes.DATE, //上架日期
    ratingAverage: DataTypes.INTEGER, //平均評價分數
    ratingCount: DataTypes.INTEGER, //評價比數
    studentCount: DataTypes.INTEGER, //學生總數
    CourseCategoryId: DataTypes.INTEGER, //FK：類別id
    CourseSubCategoryId: DataTypes.INTEGER, //FK：次類別id
    UserId: DataTypes.INTEGER
  }, {});
  Course.associate = function (models) {
    Course.belongsTo(models.User)  //一個課程被一個老師開課
    Course.belongsTo(models.CourseCategory)
    Course.belongsTo(models.CourseSubCategory)
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