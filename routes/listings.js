const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
let Listing = require('../models/listing');
require("dotenv").config();
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
        return cb(new Error(''), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'brandeno92',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
router.get('/', function(req, res){
  Listing.find({}, function(err, listing){
    if(err){
      console.log(err);
    } else{
      res.render('listings/gallery', {listing: listing});
    }
  })
});

router.get('/new', function(req, res){
  res.render('listings/new');
});

router.post('/', upload.single('image'), function(req, res){
  if(!req.file){
    req.flash('error', 'You need to upload an image.');
    res.redirect('/listings');
  } else{
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err){
        console.log(err);
        res.redirect('/listings');
      }
      // add cloudinary url for the image to the Post object under image property
      req.body.listing.image = result.secure_url;
      // add image's public_id to Post object
      req.body.listing.imageId = result.public_id;
      req.body.listing.author = {
        id: req.user._id,
        username: req.user.username
      }
      Listing.create(req.body.listing, function(err, galleryItem){
        if(err){
          console.log(err);
          return res.redirect('back');
        }
        req.flash('success', 'Successfully Added');
        res.redirect('/listings');
      });
    });
  }
});
router.get('/:id', function(req, res){
  Listing.findById(req.params.id, function(err, listing){
    if(err){
      req.flash('error', 'Oops something went wrong. Please try again.');
      res.redirect('back');
    }
    res.render('listings/show', {listing: listing});
  })
});
module.exports = router;
