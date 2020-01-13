const courses = [
  {
    name: "CS50",
    description:
      "CS50 is Harvard University's introduction to the intellectual enterprises of computer science and the art of programming. Take the course for free at your own pace at https://cs50.edx.org/.",
    image: "https://i.imgur.com/9JT0byg.png", // 上傳到IMGUR再複製連結
    introVideo: "https://www.youtube.com/embed/3oFAJtFE8YU", // youtube遷入
    teacherName: "David J. Malan",
    teacherDescrip:
      "David J. Malan is Gordon McKay Professor of the Practice of Computer Science in the School of Engineering and Applied Sciences and a Member of the Faculty of Education in the Graduate School of Education at Harvard University.",
    totalTime: 275, //單位(minutes) //依照影片長度
    totalLessons: 3, // 依照lessons數量
    price: 2500, // 1000~5000
    status: "intoMarket", // 固定
    submittedDate: new Date(), // 固定
    intoMarketDate: new Date(), // 固定
    ratingAverage: 4, // 1~5 integer
    ratingCount: 2, // 1~6 integer
    studentCount: 2, // 1~6 integer
    CourseCategoryId: 1, // 依照類別種子資料輸入
    CourseSubCategoryId: 11, // 依照類別種子資料輸入
    UserId: 1, // 固定
    createdAt: new Date(), // 固定
    updatedAt: new Date() // 固定
  }
];

module.exports = courses;
