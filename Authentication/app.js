//Node.js Dependecies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var logger = require('morgan');
var busboy = require('connect-busboy');
var methodOverride = require('method-override');
var passport = require('passport');
var fs = require('fs');
var shelljs = require("shelljs/global");
var sys = require("sys");
var googleStrategy = require('passport-google-oauth').OAuth2Strategy; //Authentication
var pg = require('pg');
var strings = require('./config/vars.json');
var RedisStore = require('connect-redis')(session);
var redis = require("redis").createClient();

var models = require('./models');
var Sequelize = require('sequelize')
    , sequelize = new Sequelize(strings.db.name, strings.db.username, strings.db.password, {
        dialect: "postgres",
        port: 5432,
    })

sequelize
    .authenticate()
    .complete(function(err) {
        if (!!err) {
            console.log("Unable to connect to database: ", err)
        } else {
            console.log("Connection has been established successfully")
        }
    })

var app = express();
	app.set('views', __dirname + '//views');
	app.use(busboy());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(logger('dev'));
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
    app.use(methodOverride());
	app.use(methodOverride('X-HTTP-Method-Override'));
	app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
	app.set('view engine', 'hbs');
    app.use(session({
        secret: strings.session,
        resave: false,
        saveUninitialized: true,
        store: new RedisStore({host: 'localhost', port: 6379, client: redis})
    }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use('/', routes);

//Google Project Credentials  
passport.use(new googleStrategy({
    clientID: strings.google.clientID,
    clientSecret: strings.google.clientSecret,
    callbackURL: strings.google.callbackURL
},

function(accessToken, refreshToken, profile, done) {
  // make the code asynchronous
  process.nextTick(function() {
      // try to find the user based on their google id
      models.User.find({where: {'email': profile.emails[0].value}}).then(function(user) {
          if (user) {
              console.log("login success!!");
              if (!user.name) {
                  user.updateAttributes({
                      'familyname': profile.name.familyName,
                      'givenname': profile.name.givenName,
              }).then(function() { 
                  console.log("updated");
              });
              }
              console.log(user.email);
              return done(null,user);
          } else if (!user && profile.email[0] == 'pisano@bu.edu') {
              models.User.create({
                  'familyname': profile.name.familyName,
                  'givenname': profile.name.givenName,
                  'email': profile.emails[0].value
              }).then(function(user) {
                  return done(null,user);
              });
          }
      })
  });
}
));

passport.serializeUser(function(user, done){
        console.log('serializing user.');
        done(null, user);
    });

passport.deserializeUser(function(user, done){
       console.log('deserialize user.');
//       models.User.find({where: {id: user.id}}).then(function(user) {
           done(null, user);
//       });
    });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

module.exports = app;

var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Application listening at http://%s:%s', host, port)

})
