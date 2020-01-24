"use strict";

// const mongoose = require('mongoose');
exports.loginForm = function (req, res) {
  res.render('login', {
    title: 'Login'
  });
};

exports.registerForm = function (req, res) {
  res.render('register', {
    title: 'Register'
  });
};

exports.validateRegister = function (req, res, next) {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'You must supply a valid email!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank!').notEmpty();
  req.checkBody('confirm-password', 'Confirmed password cannot be blank!').notEmpty();
  req.checkBody('confirm-password', 'Your passwords do not match!').equals(req.body.password);
  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors.map(function (err) {
      return err.msg;
    }));
    res.render('register', {
      title: 'Register',
      user: req.body,
      flashes: req.flash()
    });
    next();
  }

  next();
};