const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const async = require("async");
const nodemailer = require("nodemailer");
const middleware = require('../middleware/index');
const crypto = require("crypto");
let Listing = require('../models/listing');
const multer = require('multer');
require("dotenv").config();
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
        return cb(new Error(''), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'brandeno92',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});



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
router.get('/:id/edit', middleware.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err){
      console.log(err);
      res.flash('error', 'Looks like something went wrong, please try again.');
      res.redirect('back');
    } else{
      res.render('agents/edit', {user: user});
    }
  })
})

router.put("/:id", middleware.isLoggedIn, upload.single('image'), function(req, res){
  User.findById(req.params.id, async function(err, user){
    if(err){
      console.log(err);
    } else{
      if(req.file){
        try{
          await cloudinary.v2.uploader.destroy(user.imageId);
          var result = await cloudinary.v2.uploader.upload(req.file.path);
          user.imageId = result.public_id;
          user.image = result.secure_url;
        } catch(err){
          console.log(err);
          }
        }
        user.description = req.body.description;
        user.save();
        req.flash("success", "Updated.");
        res.redirect("/");
      }
    });
  });

module.exports = router;
