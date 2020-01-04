const moment = require("moment");

module.exports = {
  ifCond: function(a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  moment: function(a) {
    if (a === null) {
      return "";
    } else if (a === undefined) {
      return "";
    } else {
      moment.tz.setDefault("Asia/Taipei");
      return moment(a).format("YYYY-MM-DD, HH:mm");
    }
  },
  star_to_percent: function(starNum) {
    return 20 * starNum;
  },
  minute_to_hour: function(minute) {
    let num = minute;
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return rhours + " hrs " + rminutes + " mins";
  }
};
