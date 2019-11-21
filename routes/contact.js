const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    nodemailer = require("nodemailer");
    require("dotenv").config();


router.post('/', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'hartwebdev92@gmail.com',
      pass: process.env.GMAILPW
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: 'hartwebdev92@gmail.com',
    subject: 'New message from Blue Peaks Realty!',
    text:`${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      req.flash("error", error.responseCode + ", message didn't send. Please try again!");
      res.redirect('/');
    }
    else {
      req.flash("success", "Message sent. We will get back to you as soon as possible.")
      res.redirect('/');
    }
  });
});
module.exports = router;
