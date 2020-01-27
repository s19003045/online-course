if (process.env.NODE_ENV === "production") {
  auto_increment = 10;
} else {
  auto_increment = 1;
}

const courses = [
  {
    name: "CS50", // course_id = 1
    description:
      "CS50 is Harvard University's introduction to the intellectual enterprises of computer science and the art of programming. Take the course for free at your own pace at https://cs50.edx.org/.",
    image: "https://i.imgur.com/p0UBdr3.png", // 上傳到IMGUR再複製連結
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
    CourseSubCategoryId: 1 + auto_increment, // 依照類別種子資料輸入
    UserId: 1, // 固定
    createdAt: new Date(), // 固定
    updatedAt: new Date() // 固定
  },
  {
    name: "商管程式設計", // course_id = 2
    description:
      "本課程是為不具程式設計背景的管理學院同學設計的入門程式設計課程，以 Python 程式語言作為教學媒介，輔以作業管理、行銷管理、供應鍊管理、財務金融等商管領域的應用情境，引導非理工背景的學生理解並掌握程式設計與資訊科技在商管環境中的應用。",
    image: "https://i.imgur.com/yTcmvNe.jpg", // 上傳到IMGUR再複製連結
    introVideo: "https://www.youtube.com/embed/_2qYMKidf34", // youtube遷入
    teacherName: "孔令傑、盧信銘",
    teacherDescrip:
      "美國亞歷桑那大學 Management Information Systems 博士，國立臺灣大學經濟學碩士，國立臺灣大學工商管理學系學士。",
    totalTime: 293, //單位(minutes) //依照影片長度
    totalLessons: 3, // 依照lessons數量
    price: 1500, // 1000~5000
    status: "intoMarket", // 固定
    submittedDate: new Date(), // 固定
    intoMarketDate: new Date(), // 固定
    ratingAverage: 3, // 1~5 integer
    ratingCount: 5, // 1~6 integer
    studentCount: 0, // 1~6 integer
    CourseCategoryId: 1, // 依照類別種子資料輸入
    CourseSubCategoryId: 1, // 依照類別種子資料輸入
    UserId: 1, // 固定
    createdAt: new Date(), // 固定
    updatedAt: new Date() // 固定
  },
  {
    name: "數位語音處理", // course_id = 3
    description:
      "在Apple、Google、Microsoft等全球性產業推出行銷全球的主流產品後，語音技術如何將成為人類生活之一關鍵部份已廣為人知。",
    image: "https://i.imgur.com/RlHUKAm.jpg",
    introVideo: "https://www.youtube.com/embed/9VzHrfl_2_U",
    teacherName: "李琳山",
    teacherDescrip:
      "李琳山，台灣資訊學者，中央研究院院士，曾開發全球第一套華文語音辨識系統。曾任中央研究院資訊科學研究所所長、IEEE電信學會亞太地區主席、國立臺灣大學電機資訊學院院長，現任中央研究院資訊科學研究所合聘研究員、國立臺灣大學電機工程學系及資訊工程學系教授。",
    totalTime: 391, //單位(minutes) //依照影片長度
    totalLessons: 3, // 依照lessons數量
    price: 2500, // 1000~5000
    status: "intoMarket", // 固定
    submittedDate: new Date(), // 固定
    intoMarketDate: new Date(), // 固定
    ratingAverage: 5, // 1~5 integer
    ratingCount: 2, // 1~6 integer
    studentCount: 0, // 1~6 integer
    CourseCategoryId: 1, // 依照類別種子資料輸入
    CourseSubCategoryId: 1 + auto_increment * 6, // 依照類別種子資料輸入
    UserId: 1, // 固定
    createdAt: new Date(), // 固定
    updatedAt: new Date() // 固定
  },
  {
    name: "正是時候讀莊子", // course_id =4
    description:
      "他這麼活過他的一生，留下一本書，《莊子》。這本書影響了陶淵明的一生。影響了李太白的一生。影響了白居易的一生。影響了蘇東坡的一生。唐玄宗下詔稱此書為南華真經，尊莊子為南華真人。",
    image: "https://i.imgur.com/DUCjw5k.jpg",
    introVideo: "https://www.youtube.com/embed/s-HHnyV0VG4",
    teacherName: "蔡璧名",
    teacherDescrip:
      "大校、院優良教師，更榮獲臺大教學傑出獎，並於臺大開放式課程OCW推出「正是時候讀莊子」，累積點閱人次逾百萬；在國際線上教學平臺Coursera推出的「莊子——姿勢、意識與感情」線上課程，高踞「漢語學生學習的熱門課程」排行榜之首；二○一八年十月推出「莊子——人情」，亦居哲學類「頂級評分課程」排行首位。",
    totalTime: 180,
    totalLessons: 3,
    price: 800,
    status: "intoMarket",
    submittedDate: new Date(),
    intoMarketDate: new Date(),
    ratingAverage: 4,
    ratingCount: 5,
    studentCount: 0,
    CourseCategoryId: 1 + auto_increment * 4,
    CourseSubCategoryId: 1 + auto_increment * 23,
    UserId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "CS50's Introduction to Game Development", // course_id = 5
    description:
      "This course picks up where Harvard College’s CS50 leaves off, focusing on the development of 2D interactive games. Students explore the design of such childhood games as Super Mario Bros., Legend of Zelda, and Pokémon ......",
    image: "https://i.imgur.com/100F8Gu.png",
    introVideo: "https://www.youtube.com/embed/GfwpRU0cT10",
    teacherName: "David J. Malan",
    teacherDescrip:
      "David J. Malan (/meɪlɛn/) is Gordon McKay Professor of the Practice of Computer Science at Harvard University.[1][2] Malan is best known for teaching Computer Science 50 (known as CS50)[3][4][5][6] which is the largest course at Harvard and the ....",
    totalTime: 866,
    totalLessons: 8,
    price: 1200,
    status: "intoMarket",
    submittedDate: new Date(),
    intoMarketDate: new Date(),
    ratingAverage: 5,
    ratingCount: 5,
    studentCount: 0,
    CourseCategoryId: 1,
    CourseSubCategoryId: 1 + auto_increment * 6,
    UserId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "CS50's Mobile App Development with React Native", // course_id = 6
    description:
      "This course picks up where Harvard College’s CS50 leaves off, transitioning from web development to mobile app development with React Native, a popular open-source framework maintained by Facebook that enables cross-platform native apps using Javas..",
    image: "https://i.imgur.com/jUkGpSu.png",
    introVideo: "https://www.youtube.com/embed/_P7wHN_kOv4",
    teacherName: "David J. Malan",
    teacherDescrip:
      "David J. Malan (/meɪlɛn/) is Gordon McKay Professor of the Practice of Computer Science at Harvard University.[1][2] Malan is best known for teaching Computer Science 50 (known as CS50)[3][4][5][6] which is the largest course at Harvard and the ....",
    totalTime: 586,
    totalLessons: 6,
    price: 1000,
    status: "intoMarket",
    submittedDate: new Date(),
    intoMarketDate: new Date(),
    ratingAverage: 5,
    ratingCount: 5,
    studentCount: 0,
    CourseCategoryId: 1,
    CourseSubCategoryId: 1 + auto_increment * 5,
    UserId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = courses;
