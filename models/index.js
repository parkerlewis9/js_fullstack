var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/basketball_app");

module.exports.User = require("./user");
module.exports.Team = require("./team");
module.exports.Player = require("./player");