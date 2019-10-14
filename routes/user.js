const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
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
    }
    res.render('agents/user', {user: user});
  });
});

module.exports = router;
