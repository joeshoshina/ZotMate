const { runWeeklyMatchJob } = require("./weeklyMatchJob");

exports.runWeeklyMatchJob = runWeeklyMatchJob;
exports.testMatchmaking = require("./weeklyMatchJob").testMatchmaking;
