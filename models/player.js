var mongoose = require("mongoose");

var playerSchema = new mongoose.Schema({
						name: {
							type: String,
							// required: true
						},

            score: {
              type: String,
              // required: true
            },

            points: {
              type: String,
              // required: true
            },

            steals: {
              type: String,
              // required: true
            },

            rebounds: {
              type: String,
              // required: true
            },

            blocks: {
              type: String,
              // required: true
            },

            assists: {
              type: String,
              // required: true
            },

            imageUrl: {
              type: String,
              // required: true
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





