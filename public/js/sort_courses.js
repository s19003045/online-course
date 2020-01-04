function sortCourses(orderBy) {
  let order = ["intoMarketDate", "DESC"];
  if (orderBy === "評價由高到低") {
    order = ["ratingAverage", "DESC"];
  }
  if (orderBy === "學生人數由多到少") {
    order = ["studentCount", "DESC"];
  }
  if (orderBy === "評價人數由多到少") {
    order = ["ratingCount", "DESC"];
  }
  if (orderBy === "課程時數由多到少") {
    order = ["totalTime", "DESC"];
  }
  if (orderBy === "課程時數由少到多") {
    order = ["totalTime", "ASC"];
  }
  if (orderBy === "價格由高到低") {
    order = ["price", "DESC"];
  }
  if (orderBy === "價格由低到高") {
    order = ["price", "ASC"];
  }
  return order;
}

module.exports = sortCourses;
