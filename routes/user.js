const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Listing = require('../models/listing');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();


router.get('/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err){
      console.log(err);
      req.flash('error', err.message);
      res.redirect('/');
    } else{
    Listing.find({}, function(err, listings){
      if(err){
        console.log(err);
      } else{
        res.render('agents/user', {user: user, listings: listings});
      }
    });
  }
  });
});

module.exports = router;
