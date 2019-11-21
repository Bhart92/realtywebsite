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
router.get('/', function(req, res){
  Listing.find({}, function(err, listing){
    if(err){
      console.log(err);
    } else{
      res.render('listings/gallery', {listing: listing});
    }
  })
});

router.get('/new', middleware.isLoggedIn, function(req, res){
  res.render('listings/new');
});

router.post('/', middleware.isLoggedIn, upload.single('image'), function(req, res){
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
// router.get('/:id/edit', middleware.isLoggedIn, middleware.checkListingOwnership, function(req, res){
//   Listing.findById(req.params.id, function(err, listing){
//     if(err){
//       console.log(err);
//       req.flash('error', 'Oops something went wrong! Try again please');
//     } else{
//       res.render('listings/edit', {listing: listing});
//     }
//   })
// })
// router.put('/:id', upload.single('image'), function(req, res){
//   Listing.findById(req.params.id, async function(err, listing){
//     if(err){
//       console.log(err);
//     } else{
//       if(req.file){
//         try{
//           await cloudinary.v2.uploader.destroy(listing.imageId);
//           var result = await cloudinary.v2.uploader.upload(req.file.path);
//           listing.imageId = result.public_id;
//           listing.image = result.secure_url;
//         } catch(err){
//           console.log(err);
//           }
//         }
//         listing.address = req.body.address;
//         listing.city = req.body.city;
//         listing.zipCode = req.body.zipCode;
//         listing.sqft = req.body.sqft;
//         listing.lotSize = req.body.lotSize;
//         listing.yearBuilt = req.body.yearBuilt;
//         listing.bathrooms = req.body.bathrooms;
//         listing.price = req.body.price;
//         listing.yearBuilt = req.body.yearBuilt;
//         listing.amenities = req.body.amenities;
//         listing.description = req.body.description;
//         listing.save();
//         req.flash("success", "Successfully Updated!");
//         res.redirect("/");
//       }
//     });
// });
router.delete("/:id", middleware.isLoggedIn, middleware.checkListingOwnership, function(req, res){
  Listing.findById(req.params.id, async function(err, listing){
    if(err){
      req.flash("error", err.message);
      return res.redirect("back");
    } else {
      try{
                //  delete the campground
                await cloudinary.v2.uploader.destroy(listing.imageId);
                listing.remove();
                req.flash("success", "Listing deleted!");
                res.redirect('/listings');
      } catch(err){
        console.log(err);
        res.redirect('back');
      }
    }
  });
});
module.exports = router;
