const User = require('../models/user');
const Listing = require('../models/listing');

let middleware = {};

middleware.checkListingOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Listing.findById(req.params.id, function(err, foundCampground){
      if(err || !foundCampground){
        req.flash("error", "Listing not found.");
        res.redirect("back");
      } else{
        if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
          next();
        } else{
          req.flash("error", "Need permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else{
    req.flash("error", "You need to be logged in to do that.");
      res.redirect("back");
  }
};

middleware.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login first!");
  res.redirect('/login');
}

module.exports = middleware;
