var db = require("../models");

var routeHelpers = {
  // ensureLoggedIn: function(req, res, next) {
  //   if (req.session.id !== null && req.session.id !== undefined) {
  //     return next();
  //   }
  //   else {
  //    res.redirect('/login');
  //   }
  // },

  // ensureCorrectUserForPost: function(req, res, next) {
  //   db.Post.findById(req.params.id, function(err,doc){
  //     if (doc.user != req.session.id) {
  //       res.redirect("/posts")
  //     }
  //     else {
  //      return next();
  //     }
  //   });
  // },

  // ensureCorrectUserForComment: function(req, res, next) {
  //   db.Comment.findById(req.params.id, function(err,doc){
  //     if (doc.user != req.session.id) {
  //       db.Comment.findById(req.params.id, function(err, comment) {
  //         res.redirect("/posts/" + comment.post + "/comments")
  //       })
  //     } else {
  //      return next();
  //     }
  //   });
  // },

  preventLoginSignup: function(req, res, next) {
    // req.session.id !== null && 
    if (req.user !== undefined) {
      res.redirect('/teams');
    }
    else {
     return next();
    }
  }
};
module.exports = routeHelpers;