var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String,
  email: {type: String, unique: true, required: true},
  description: String,
  image: {type: String, default:'#'},
  resetPasswordToken: String,
  resetPasswordToken: Date,
  confirmation: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
