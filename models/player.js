var mongoose = require("mongoose");

var playerSchema = new mongoose.Schema({
						name: {
							type: String,
						},

            score: {
              type: String,
            },

            points: {
              type: String,
            },

            steals: {
              type: String,
            },

            rebounds: {
              type: String,
            },

            blocks: {
              type: String,
            },

            assists: {
              type: String,
            },

            imageUrl: {
              type: String,
            },

						owner: {
                      		type: mongoose.Schema.Types.ObjectId,
                      		ref: "User"
                    	},
            team: {
                      		type: mongoose.Schema.Types.ObjectId,
                      		ref: "Team"
                    	}
});


var Player = mongoose.model("Player", playerSchema);

module.exports = Player;





