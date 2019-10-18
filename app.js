const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      methodOverride = require('method-override'),
      localStrategy = require('passport-local'),
      port = 3000 || process.env.PORT,
      flash = require('connect-flash');
let User = require('./models/user');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const listingsRoutes = require('./routes/listings');
const contactRoutes = require('./routes/contact');


mongoose.connect('mongodb://localhost:27017/realty', {useNewUrlParser: true});
// mongoose.connect("mongodb+srv://bhart:bella21@cluster0-9mb0e.mongodb.net/yelpCamp?retryWrites=true", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
// });

// config
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(flash());

//Express session config
app.use(require('express-session')({
  secret: 'EnkiRealty',
  resave: false,
  saveUninitialized: false
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// config
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  // res.locals.moment = require('moment');
  next();
});

app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/listings", listingsRoutes);
app.use("/contact", contactRoutes);


app.get('/', function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err){
      console.log(err);
      req.flash('error', err.message);
      res.redirect('/listings');
    }
    res.render('landing.ejs', {user: user});
  });
});

app.listen(3000, function(){
  console.log('live');
});
