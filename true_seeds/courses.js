const courses = [
  {
    name: "APP創業與實作",
    description:
      "培養學生在APP 創業所需的各種能力，其中包括培養學生的創業思維、教導學生編寫及完成APP 所需的語言及技術、商業行為有關的經營行銷及財務策略、和創業所涉及法務層面的知識。結合四個不同單位的資源，邀請Google、VMFive、Colorgy、Acer等不同領域的講師，不僅提供技術層面的協助，也會與學生進行經驗分享，讓學生跳脫傳統被動聽課的框架，並透過互動的方式激發他們的創意和膽識，使創意能夠具體化及商品化，協助他們與產業合作，讓夢想加速實現。",
    image: "https://i.imgur.com/R6S7Rlb.png",
    introVideo: "https://www.youtube.com/embed/V3c0hr7_VY8",
    teacherName: "黃俊龍老師、丁俊宏老師、高子漢老師",
    teacherDescrip: "資訊工程學系教師群",
    totalTime: 100, //單位(minutes)
    totalLessons: 5,
    price: 2500,
    status: "intoMarket",
    submittedDate: new Date(),
    intoMarketDate: new Date(),
    ratingAverage: 4,
    ratingCount: 2,
    studentCount: 2,
    CourseCategoryId: 1,
    CourseSubCategoryId: 1,
    UserId: 1, //1 ~ 6
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = courses;
