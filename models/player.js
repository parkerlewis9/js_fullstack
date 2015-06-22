var mongoose = require("mongoose");

var playerSchema = new mongoose.Schema({
						name: {
							type: String,
							required: true
						},

            score: {
              type: Number,
              required: true
            },

            points: {
              type: Number,
              required: true
            },

            steals: {
              type: Number,
              required: true
            },

            rebounds: {
              type: Number,
              required: true
            },

            blocks: {
              type: Number,
              required: true
            },

            assists: {
              type: Number,
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
            team: {
                      		type: mongoose.Schema.Types.ObjectId,
                      		ref: "Team"
                    	}
});


var Player = mongoose.model("Player", playerSchema);

module.exports = Player;





