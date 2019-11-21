const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const async = require('async');
const nodemailer = require('nodemailer');
const middleware = require('../middleware/index');
const crypto = require('crypto');
require('dotenv').config();


router.get('/login', function(req, res){
  res.render('login.ejs');
});

router.post('/login', passport.authenticate('local',
{
  successRedirect: '/', failureRedirect: '/login'
}), function(req, res){
});
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Logged out!');
  res.redirect('/');
});

router.post('/register', function(req, res){
  if(req.body.confirmation === 'bluePeaksAgent'){
    var newUser = new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      description: req.body.description
      });
      newUser.confirmation = true;
  } else{
    req.flash('error', 'Sorry you need an invitation to make an account.');
    res.redirect('back');
  }
User.register(newUser, req.body.password, function(err, user){
  if(err){
    console.log(err);
    req.flash('error', 'try again');
    return res.redirect('back');
  }
    passport.authenticate('local')(req, res, function(){
      req.flash('success', 'Account created. You can edit your information through your account page. Welcome to the team ' + user.username + '!');
    res.redirect('/listings');
    });
  });
});
router.get('/forgot', function(req, res){
  res.render('forgot');
});
router.post('/forgot', function(req, res, next){
  async.waterfall([
    function(done){
      crypto.randomBytes(20, function(err, buf){
        if(err){
          req.flash('Something went wrong, please try again');
          res.redirect('back');
        }
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done){
      User.findOne({email: req.body.email }, function(err, user){
        if(err){
          req.flash('Something went wrong, please try again');
          res.redirect('back');
        }
        if(!user){
          req.flash('error', 'No account with that email address found');
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // pass change token expires after 1 hour

        user.save(function(err){
          done(err, token, user);
        });
      });
    },
    function(token, user, done){
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'hartwebdev92@gmail.com', //Left of at 6:30 for youtube course -- password reset ********************!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hartwebdev92@gmail.com',
        text: 'Click the link below to change your password. http://' + req.headers.host + '/reset/' + token + '\n\n'
      };
      smtpTransport.sendMail(mailOptions, function(err){
        if(err){
          req.flash('Something went wrong, please try again');
          res.redirect('back');
        }
        console.log('mail sent');
        req.flash('success', 'Reset link sent!');
        done(err, 'done');
      });
    }
  ], function(err){
    if(err) return next(err);
    res.redirect('/forgot');
  });
});
router.get('/reset/:token', function(req, res){
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
    if(err){
      req.flash('error', 'Something went wrong, try again.');
      res.redirect('/');
    }
    if(!user){
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});
router.post('/reset/:token', function(req, res){
  async.waterfall([
    function(done){
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
        if(err){
          req.flash('error', 'Something went wrong, try again.');
          res.redirect('back');
        }
        if(!user){
          return res.redirect('/forgot');
        }
        if(req.body.password === req.body.confirm){
          user.setPassword(req.body.password, function(err){
            if(err){
              req.flash('error', 'Something went wrong, try again.');
              res.redirect('/');
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err){
              if(err){
                req.flash('error', 'Something went wrong, try again.');
                res.redirect('back');
              }
              req.logIn(user, function(err){
                done(err, user);
              });
            });
          });
        } else{
          return res.redirect('back');

        }
      });
    },
    function(user, done){
       var smtpTransport = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
           user: 'hartwebdev92@gmail.com',
           pass: process.env.GMAILPW
         }
       });
       var mailOptions = {
         to: user.email,
         from: 'hartwebdev92.com',
         subject: 'Your password has been changed',
         text: 'Hello, \n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed'
       };
       smtpTransport.sendMail(mailOptions, function(err){
         if(err){
           req.flash('error', 'Something went wrong, try again.');
           res.redirect('back');
         }
         req.flash('success', 'Password sucessfully changed!');
         res.render('landing');
         done(err);
       });
    }
  ],function(err){
    if(err){
      req.flash('error', 'Something went wrong, try again.');
      res.redirect('back');
    } else{
      req.flash('success', 'Password sucessfully changed!');
      res.render('landing');

    }
  });
});

module.exports = router;
