const admin = require("firebase-admin");
admin.initializeApp();

const { dailyRentCheck } = require("./cron/dailyRentCheck");
const { monthlyBilling } = require("./cron/monthlyBilling");
const { adminLogin, getAllBuilders, getBuilderDetails } = require("./admin");

exports.dailyRentCheck = dailyRentCheck;
exports.monthlyBilling = monthlyBilling;
exports.adminLogin = adminLogin;
exports.getAllBuilders = getAllBuilders;
exports.getBuilderDetails = getBuilderDetails;
