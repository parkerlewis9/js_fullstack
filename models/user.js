var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var mongoose = require("mongoose");

// Define Schema

var userSchema = new mongoose.Schema({

		username: {
			type: String,
			// unique: true,
			// required: true
		},
    facebookId: String,
		password: {
			type: String,
			// required: true
		},
		teams: [{
	        type: mongoose.Schema.Types.ObjectId,
	        ref: "Team"
	    }],
	    players: [{
	        type: mongoose.Schema.Types.ObjectId,
	        ref: "Player"
	    }]
})

//Before a user is made, make the password a hash:

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      return next();
    });
  });
});

//TODO - remove players and teams from db when user is removed

//Give schema a way to authenticate

userSchema.statics.authenticate = function (formData, callback) {
  this.findOne({
      username: formData.username
    },
    function (err, user) {
      if (user === null){
        callback("Invalid username or password",null);
      }
      else {
        user.checkPassword(formData.password, callback);
      }

    });
};

//Helper to authenticate

userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};

//Make into a model and export it

var User = mongoose.model("User", userSchema);

module.exports = User;








