//get all the tools we need
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var Grid = require('gridfs-stream');
var session = require('express-session');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(function(req, res, next) {
  //res.setHeader('Content-Type', ' multipart/form-data');
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, multipart/form-data, Accept, Authorization, charset=UTF-8');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

var configDB = require('./config/database.js');

var Profile = require('./models/profile.js');

var multer = require('multer');
//var upload = multer({ dest: 'uploads/' });

//configuration

mongoose.connect(configDB.url); // connect to our database
var db = mongoose.connection;
mongoose.Promise = global.Promise;
Grid.mongo = mongoose.mongo;
var gfs;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
  gfs = Grid(db.db);

  app.addImage = function(image, callback) {
    Profile.create(image, callback);
  };

  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname + Date.now());
    }
  });

  var upload = multer({
    storage: storage
  });

    // create profile
  app.post('/profile', upload.array('img', 8), function(req, res, next) {

    var obj = new Profile();
    //console.log(req.files);
    obj.images = req.files;

    obj.name = req.body.name;
    obj.country = req.body.country;
    obj.region = req.body.region;
    obj.date = req.body.date;
    obj.title = req.body.title;
    obj.comment = req.body.comment;
      /*  obj.save(function(err, obj) {
     if(err) return console.error(err);
     res.status(200).json(obj);
     });*/

    obj.save((err, obj) => {
      if(err) {
        res.send('There was a problem adding the information to the database.')
      } else {
        // console.log('POST creating new profile: ' + obj);
        res.format({

          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          html: () => {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location('http://localhost:4200/');
            // And forward to success page
            res.redirect('http://localhost:4200/');
          },
          //JSON response will show the newly created blob
          json: () => {
            res.json(obj);
            res.send(req.files)
          }
        });
      }
    });
  });

  require('./config/passport')(passport); // pass passport for configuration

// view engine setup jade
  app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// view engine setup ejs
  app.set('view engine', 'ejs');
// Point static path to ngCms/dist
  app.use(express.static(path.join(__dirname, 'uploads')));
  app.use(express.static(path.join(__dirname, 'ngClient/dist')));
  app.use(express.static(path.join(__dirname, 'public')));


//require for passport
  app.use(session({secret: 'ilovecodecodecode', cookie: {maxAge: 60000}, resave: true, saveUninitialized: true})); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

 /* app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ngClient/dist/index.html'));
  });*/

// routes ======================================================================
  require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
  //var index = require('./routes/index');
  //var users = require('./routes/users');

  // app.use('/', index);
  // app.use('/users', users);

// catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});
module.exports = app;
