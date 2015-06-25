var db = require("../models");

var loginHelpers = function (req, res, next) {

  req.login = function (user) {
    req.session.id = user._id;
  };

  req.logout = function () {
    req.session.id = null;
  };

  next();
};

// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next()
// 	}
// 		res.redirect("/")
// }

// app.use(isLoggedIn)

module.exports = loginHelpers;