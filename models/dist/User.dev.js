"use strict";

var mongoose = require('mongoose');

var validator = require('validator');

var mongodbErrorHandler = require('mongoose-mongodb-errors');

var passportLocalMongoose = require('passport-local-mongoose'); // mongoose.Promise = global.Promise;


var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address!'],
    required: 'Please enter an email address!'
  },
  name: {
    type: String,
    trim: true,
    required: 'Please enter a name!'
  }
});
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});
userSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('User', userSchema);