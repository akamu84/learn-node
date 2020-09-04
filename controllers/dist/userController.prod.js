"use strict";exports.loginForm=function(e,o){o.render("login",{title:"Login"})},exports.registerForm=function(e,o){o.render("register",{title:"Register"})},exports.validateRegister=function(e,o,r){e.sanitizeBody("name"),e.checkBody("name","You must supply a name!").notEmpty(),e.checkBody("email","You must supply a valid email!").isEmail(),e.sanitizeBody("email").normalizeEmail({remove_dots:!1,remove_extension:!1,gmail_remove_subaddress:!1}),e.checkBody("password","Password cannot be blank!").notEmpty(),e.checkBody("confirm-password","Confirmed password cannot be blank!").notEmpty(),e.checkBody("confirm-password","Your passwords do not match!").equals(e.body.password);var s=e.validationErrors();s&&(e.flash("error",s.map(function(e){return e.msg})),o.render("register",{title:"Register",user:e.body,flashes:e.flash()}),r()),r()};