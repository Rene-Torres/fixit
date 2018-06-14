///////////////////////////////
///////  INSTALACIONES  ///////
///////////////////////////////
const express = require('express');
const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");
const multer = require("multer");
const uploads = multer({dest: './public/uploads'});
const ensureLogin = require("connect-ensure-login");

const Project = require('../models/Project');




/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



//////////////////////////////////////////////
///////  RUTAS PARA SIGNUP CON GOOGLE  ///////
//////////////////////////////////////////////

router.get("/google-login", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

router.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/profile"
}));

module.exports = router;
