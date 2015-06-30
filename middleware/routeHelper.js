var db = require("../models");

var routeHelpers = {

  preventLoginSignup: function(req, res, next) {
    if (req.user !== undefined) {
      res.redirect('/teams');
    }
    else {
     return next();
    }
  }
};
module.exports = routeHelpers;