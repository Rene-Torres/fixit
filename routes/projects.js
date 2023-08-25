const router = require('express').Router();
const Project = require('../models/Project');
const User = require('../models/User');
const upload = require('multer')({ dest: './public/pics' });
const mongoose = require('mongoose');
const uploads = require('../helpers/cloudinary');
const multer = require('multer');

const Offer = require('../models/Offer');

router.get('/:id', (req, res) => {
  const projects = Project.find();
  let _id = req.params.id;
  Project.findById({ _id })
    .populate('user')
    .then((project) => {
      res.render('auth/job-detail', { project });
    });
});

router.get('/', (req, res, next) => {
  const projects = Project.find()
    .populate('user', 'name')
    .then((projects) => {
      res.render('auth/jobs', { projects, user: req.user });
    });
});


router.post('/new', uploads.array('photos', 5), (req, res, next) => {

  req.body.photos = req.files.map((file) => file.path)

  req.body.user = req.user._id;

  Project.create(req.body)
    .then((project) => {

      req.user.projects.push(project._id);
      return User.findByIdAndUpdate(req.user._id, req.user);
    })
    .then((user) => {
      res.redirect('/profile');
    })
    .catch((e) => next(e));
});
//

module.exports = router;
//
