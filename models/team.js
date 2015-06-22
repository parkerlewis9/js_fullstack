var mongoose = require("mongoose");

var teamSchema = new mongoose.Schema({
			name: {
				type: String,
				required: true
			},
			imageUrl: {
				type: String,
				required: true
			},
			owner: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            },

			players: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Player"
			}],
})


// TODO - Getting rid of players when deleting teams


var Team = mongoose.model("Team", teamSchema);

module.exports = Team;