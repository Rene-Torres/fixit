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
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const mongoose = require("mongoose");
const Project = require('../models/Project');
const time = require('time')(Date);
const Offer = require('../models/Offer');


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alejandrosg11@gmail.com',
    pass: 'Al##11081989'
  }
});

var mailOptions = {
  from: 'fixitnow@gmail.com',
  to: 'alejandrosg11@gmail.com',
  subject: 'FIXIT-NOW Worker Hired',
  text: 'Worker hired in our platform FIXIT-NOW for your project number #02394, Worker: Rene Torres, Contact number :2226620768, email: rene@mail.com'
};

router.get('/sendmail', (req,res)=>{
  res.render('auth/sendmail',{error:req.body.error})
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  });



  router.get('/users', (req, res, next)=>{
    const users= User.find()
    .populate('projects')
        .populate('offers')
    .then(users=>{
        console.log(users)
    res.render('auth/users', {users:users, projects:req.projects});
    })
  });

///////////////////////////////////////////
///////  Autentificacion de sesión  ///////
/////////////////////////////////////////

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/profile')
  }
  return next();
}

function isNotAuth(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/login');
}
//probando
///////////////////////////////////
///////  RUTAS PARA Profile  ///////
///////////////////////////////////


router.get('/profile', isNotAuth, (req,res, next)=>{
    User.findById(req.user._id)
    .populate({
      path:'projects',
      populate: { path: 'offers' }
    })
    .then(user=>{
      console.log(user)
    res.render('auth/profile', {user});
    })
    .catch(e=>next(e))
  })



    router.post('/profile', uploads.single('profilePhoto'),(req, res, next)=>{
      req.body.profilePhoto = "/uploads/" + req.file.filename;
      User.findByIdAndUpdate(req.user._id, req.body, {new:true})
      .then((user)=>{

        User.findById(user._id)
        .populate({
          path:'projects',
          populate: { path: 'offers' }
        })
        .then(user=>{
          req.user.message = "foto actualizada";
          res.render('auth/profile', {user});
        })
      })
      .catch(e=>next(e));
    })
///////////////////////////////////
///////  RUTAS PARA LOGIN  ////////
///////////////////////////////////
router.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/login');
})

router.get("/login", isAuthenticated, (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login",
passport.authenticate("local"), (req, res)=>{
  return res.redirect('/profile')
});
///////////////////////////////////
///////  RUTAS PARA SIGNUP  ///////
///////////////////////////////////

router.get('/signup', (req,res)=>{
res.render('auth/signup',{error:req.body.error});
});

router.post('/signup',
    (req,res)=>{
    req.body._id = new mongoose.Types.ObjectId();
        User.register(req.body, req.body.password, function(err, user) {
            if (err) return res.send(err);
            const authenticate = User.authenticate();
            authenticate(req.body.email, req.body.password, function(err, result) {
              if (err) return res.send(err);
              return res.redirect('/login');
            })
        })
    });
/////////////////////////////
// Google Login Middleware //
/////////////////////////////

passport.use(new GoogleStrategy({
    clientID: "796743130836-dd1ro4b9d0i1qje3rns5md8kmo84q3a5.apps.googleusercontent.com",
    clientSecret: "aoraPuQr9mgMnXCv4YMAqrLG",
    callbackURL: "/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleID: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        googleID: profile.id,
        username: profile.emails[0].value,
        name: profile.displayName,
        email: profile.emails[0].value
      });

      newUser.save((err) => {
        if (err) {
          return done(err);
        }
        done(null, newUser);
      });
    });

  }));



module.exports = router;
