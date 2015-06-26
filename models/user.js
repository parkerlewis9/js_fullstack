var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var mongoose = require("mongoose");
var findOrCreate = require('mongoose-findorcreate');
var passport = require("passport");
var LocalStrategy = require("passport-local");

// Define Schema

var userSchema = new mongoose.Schema({

		// username: {
		// 	type: String,
		// 	// unique: true,
		// 	// required: true
		// },

    local: {
      username: String,
      password: String,
    },

    facebookId: String,

		// password: {
		// 	type: String,
		// 	// required: true
		// },

		teams: [{
	        type: mongoose.Schema.Types.ObjectId,
	        ref: "Team"
	    }],

	   players: [{
	        type: mongoose.Schema.Types.ObjectId,
	        ref: "Player"
	    }]
})

userSchema.plugin(findOrCreate);

//Before a user is made, make the password a hash:

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('local.password')) {
    return next();
  }
  return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.local.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.local.password = hash;
      return next();
    });
  });
});

//TODO - remove players and teams from db when user is removed

//Give schema a way to authenticate

  

//Helper to authenticate

userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, user.local.password, function (err, isMatch) {
    if (isMatch) {
      console.log("EVERYTHING WORKED PERFECTLY!")
      callback(null, user);
    } else {
      console.log("PASS DOES NOT MATCH")
      callback(err, null);
    }
  });
};






//Make into a model and export it

var User = mongoose.model("User", userSchema);

module.exports = User;








