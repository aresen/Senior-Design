//Node.js Dependecies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var logger = require('morgan');
<<<<<<< Updated upstream
var FacebookStrategy = require('passport-facebook');
=======
>>>>>>> Stashed changes
var expressHbs = require('express-handlebars');
var logger = require('morgan');
var busboy = require('connect-busboy');
var methodOverride = require('method-override');
var passport = require('passport');
var fs = require('fs');
var shelljs = require("shelljs/global");
var sys = require("sys");

var auth = require('./auth/google');

var strings = require('./config/vars');

//App configuration settings
var app = express();
	app.set('views', __dirname + '\\views');
	app.use(busboy());
	app.use('/', routes);
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use('/users', users);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(methodOverride('X-HTTP-Method-Override'));
	app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
	app.set('view engine', 'hbs');

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
