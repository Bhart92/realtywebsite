const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

router.get('/login', function(req, res){
  res.render('login.ejs');
});

router.post("/login", passport.authenticate("local",
{
  successRedirect: "/", failureRedirect: "/login"
}), function(req, res){
});
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged out!");
  res.redirect("/");
});

router.post("/register", function(req, res){
  if(req.body.confirmation === 'enkiAgent'){
    var newUser = new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      description: req.body.description
      });
      newUser.confirmation = true;
  } else{
    req.flash("error", "Sorry you need an invitation to make an account.");
    res.redirect('back');
  }
User.register(newUser, req.body.password, function(err, user){
  if(err){
    console.log(err);
    req.flash("error", "try again");
    return res.redirect("back");
  }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Account created. You can edit your information through your account page. Welcome to the team! " + user.username );
    res.redirect("/listings");
    });
  });
});

module.exports = router;
