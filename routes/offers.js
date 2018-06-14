const router = require('express').Router();
const Project = require('../models/Project');
const User = require('../models/User');
const Review = require('../models/Review');
const upload = require('multer')({dest: './public/pics'});
const mongoose = require("mongoose");
const Offer = require('../models/Offer');


const checkRole = (req, res, next)=>{
  User.findOne({username: req.body.username})
  .then(user=>{
    if(user.role ==="WORKER"){
      console.log(user)
    return next();
    }
    // res.send('no hay acceso');
  }).catch(e=> console.log(e))
  }





    router.post('/offers', (req, res, next)=>{
  req.body.offers = [];
  req.body.user = req.user._id;
  Offer.create(req.body)
  .then(offer=>{
    req.body.offers.push(offer._id);
      req.user.offers.push(offer);
      let project_update = Project.findByIdAndUpdate(offer.projects, {$push: {offers: offer._id}}, {new:true})
      let user_update = User.findByIdAndUpdate(req.user._id, req.user)

      Promise.all([project_update, user_update])
        .then(()=>{
          res.redirect('/profile')
        })

    })});



    router.get('/', (req, res, next)=>{
      const offers = Offer.find()
      .populate('user')
    .then(offers=>{
      console.log(offers)
      res.render('auth/offers',{offers,user:req.user})
    })
  });



    // Offers detail


router.get('/:id', (req, res)=>{
  Offer.findOne({
      _id: req.params.id
  })
      .populate('user')
      .populate('projects')
      .then(offer=>{
        console.log(offer)
          res.render('auth/offer-detail',{offer:offer,user:req.user, projects:req.projects})
})
})

  router.post('/new',(req,res, next)=>{

    console.log("perro", req.body);

      req.body.offers = [];
      req.body.user = req.user._id;
      Offer.create(req.body)
      .then(offer=>{
        req.body.offers.push(offer._id);
          req.user.offers.push(offer);

          let project_update = Project.findByIdAndUpdate(offer.projects, {$push: {offers: offer._id}}, {new:true})
          let user_update = User.findByIdAndUpdate(req.user._id, req.user)

          Promise.all([project_update, user_update])
            .then(()=>{
              res.redirect('/profile')
            })


          //return User.findByIdAndUpdate(req.user._id, req.user)
      })
      // .then(user=>{
      //     res.redirect('/profile')
      // })
      .catch(e=>next(e))

  });











module.exports = router;
