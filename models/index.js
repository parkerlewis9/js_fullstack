var mongoose = require("mongoose");
mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost/basketball_app2");

mongoose.set("debug", true)

module.exports.User = require("./user");
module.exports.Team = require("./team");
module.exports.Player = require("./player");