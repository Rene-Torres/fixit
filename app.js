require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./helpers/passport');
const User = require('./models/User');
const moment = require('helper-moment');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to Mongo!');
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(
  `${app_name}:${path.basename(__filename).split('.')[0]}`
);

const app = express();

// helpers
hbs.registerHelper('counter', function (index) {
  return index + 1;
});

hbs.registerHelper('moment', require('helper-moment'));

//session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//////////////////////
// Middleware Setup //
//////////////////////
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

///////////////////////////////
// Express View engine setup //
///////////////////////////////

app.use(
  require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true,
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

///////////////////////////////////
// default value for title local //
///////////////////////////////////

app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index');
const auth = require('./routes/auth');
const projects = require('./routes/projects');
const offers = require('./routes/offers');
app.use('/offers', offers);
app.use('/', index);
app.use('/', auth);
app.use('/projects', projects);

module.exports = app;
