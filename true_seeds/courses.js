const courses = [
  {
    name: "CS50",
    description:
      "CS50 is Harvard University's introduction to the intellectual enterprises of computer science and the art of programming. Take the course for free at your own pace at https://cs50.edx.org/.",
    image: "https://i.imgur.com/9JT0byg.png",
    introVideo: "https://www.youtube.com/embed/3oFAJtFE8YU",
    teacherName: "David J. Malan",
    teacherDescrip:
      "David J. Malan is Gordon McKay Professor of the Practice of Computer Science in the School of Engineering and Applied Sciences and a Member of the Faculty of Education in the Graduate School of Education at Harvard University.",
    totalTime: 275, //單位(minutes)
    totalLessons: 3,
    price: 2500,
    status: "intoMarket",
    submittedDate: new Date(),
    intoMarketDate: new Date(),
    ratingAverage: 4,
    ratingCount: 2,
    studentCount: 2,
    CourseCategoryId: 1,
    CourseSubCategoryId: 11,
    UserId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = courses;
