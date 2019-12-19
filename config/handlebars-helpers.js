const moment = require("moment");

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  moment: function (a) {
    if (a === null) {
      return ''
    } else if (a === undefined) {
      return ''
    } else {
      moment.tz.setDefault("Asia/Taipei");
      return moment(a).format("YYYY-MM-DD, HH:mm");
    }
  }
};
