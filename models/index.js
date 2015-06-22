var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/basketball_app");

mongoose.set("debug", true)

module.exports.User = require("./user");
module.exports.Team = require("./team");
module.exports.Player = require("./player");